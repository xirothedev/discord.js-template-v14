import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { formatUsage, parseCliArgs } from './args';
import { generatePrismaClient, initializeGitRepo, installDependencies } from './bootstrap';
import { buildEnvFile, parseEnvExample } from './env';
import { buildDefaultDatabaseUrl } from './naming';
import { collectPromptValues } from './prompts';
import { copyTemplate, updatePackageName } from './template';
import type { PromptValues } from './types';
import { ensureEmptyTargetDirectory } from './validate';

const SRC_DIR = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_DIR = path.resolve(SRC_DIR, '..');
const TEMPLATE_DIR = path.join(PACKAGE_DIR, 'template');

export async function createProject(argv: string[]): Promise<void> {
	const { projectName: projectNameArg, flags } = parseCliArgs(argv);

	if (flags.help) {
		console.log(formatUsage());
		return;
	}

	const projectInput = await resolveProjectName(projectNameArg, flags.yes);
	const targetDir = path.resolve(process.cwd(), projectInput);
	const appName = path.basename(targetDir);

	await ensureEmptyTargetDirectory(targetDir);

	const envExamplePath = path.join(TEMPLATE_DIR, '.env.example');
	const envExampleContent = await readFile(envExamplePath, 'utf8');
	const envDefaults = parseEnvExample(envExampleContent);

	const promptDefaults: PromptValues = {
		token: '',
		clientId: '',
		owner: envDefaults.OWNER ?? '',
		developers: envDefaults.DEVELOPERS ?? envDefaults.OWNER ?? '',
		prefix: envDefaults.PREFIX ?? 's?',
		databaseUrl: buildDefaultDatabaseUrl(appName),
		redisUrl: envDefaults.REDIS_URL ?? 'redis://127.0.0.1:6379/0',
	};

	const values = await collectPromptValues({
		defaults: promptDefaults,
		overrides: {
			token: flags.token,
			clientId: flags.clientId,
			owner: flags.owner,
			developers: flags.developers,
			prefix: flags.prefix,
			databaseUrl: flags.databaseUrl,
			redisUrl: flags.redisUrl,
		},
		yes: flags.yes,
	});

	await copyTemplate(TEMPLATE_DIR, targetDir);
	await updatePackageName(targetDir, appName);

	const envPath = path.join(targetDir, '.env');
	const envFileContent = buildEnvFile(envExampleContent, values);
	await writeFile(envPath, envFileContent, 'utf8');

	if (!flags.skipInstall) {
		console.log('📦 Installing dependencies with Bun...');
		await installDependencies(targetDir);

		console.log('🧬 Generating Prisma client...');
		try {
			await generatePrismaClient(targetDir);
		} catch (error) {
			console.warn('⚠️ Prisma client generation failed. You can re-run `bunx prisma generate` manually.');
			if (error instanceof Error) {
				console.warn(error.message);
			}
		}
	}

	if (!flags.noGit) {
		await initializeGitRepo(targetDir);
	}

	printNextSteps(targetDir, flags.skipInstall);
}

async function resolveProjectName(projectNameArg: string | undefined, yes: boolean): Promise<string> {
	if (projectNameArg && projectNameArg.trim()) {
		return projectNameArg.trim();
	}

	if (yes) {
		throw new Error('Project directory is required when using --yes.');
	}

	const { createInterface } = await import('node:readline/promises');
	const { stdin: input, stdout: output } = await import('node:process');
	const readline = createInterface({ input, output });
	try {
		const response = (await readline.question('Project name: ')).trim();
		if (!response) {
			throw new Error('Project name is required.');
		}
		return response;
	} finally {
		readline.close();
	}
}

function printNextSteps(targetDir: string, skipInstall: boolean): void {
	console.log('\n✅ Project ready.');
	console.log('\nNext steps:');
	console.log(`  cd ${targetDir}`);
	if (skipInstall) {
		console.log('  bun install');
		console.log('  bunx prisma generate');
	}
	console.log('  bun dev');
}
