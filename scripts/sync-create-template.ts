import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const packageDir = path.join(rootDir, 'packages', 'create-discord-app');
const templateDir = path.join(packageDir, 'template');

const excluded = new Set(['.git', 'node_modules', '.env', 'packages', 'scripts', 'docs', 'generated']);

async function syncTemplate(): Promise<void> {
	await rm(templateDir, { recursive: true, force: true });
	await mkdir(templateDir, { recursive: true });
	await copyDirectory(rootDir, templateDir);
	console.log(`Synced template to ${templateDir}`);
}

async function copyDirectory(sourceDir: string, destinationDir: string): Promise<void> {
	const entries = await readdir(sourceDir);
	for (const entry of entries) {
		const sourcePath = path.join(sourceDir, entry);
		const relativePath = path.relative(rootDir, sourcePath).replaceAll('\\', '/');

		if (shouldSkip(relativePath)) {
			continue;
		}

		const sourceStat = await stat(sourcePath);
		const mappedEntry = entry === '.gitignore' ? '_gitignore' : entry;
		const destinationPath = path.join(destinationDir, mappedEntry);

		if (sourceStat.isDirectory()) {
			await mkdir(destinationPath, { recursive: true });
			await copyDirectory(sourcePath, destinationPath);
			continue;
		}

		const content = await readFile(sourcePath);
		await writeFile(destinationPath, content);
	}
}

function shouldSkip(relativePath: string): boolean {
	if (!relativePath) return true;
	if (excluded.has(relativePath)) return true;
	if (relativePath.startsWith('.git/')) return true;
	if (relativePath.startsWith('node_modules/')) return true;
	if (relativePath.startsWith('packages/')) return true;
	if (relativePath.startsWith('scripts/')) return true;
	if (relativePath.startsWith('docs/')) return true;
	if (relativePath.startsWith('generated/')) return true;
	return false;
}

await syncTemplate();
