import type { CliFlags, ParseResult } from './types';

const stringFlagMap: Record<string, keyof Omit<CliFlags, 'yes' | 'noGit' | 'skipInstall' | 'help'>> = {
	'--token': 'token',
	'--client-id': 'clientId',
	'--owner': 'owner',
	'--developers': 'developers',
	'--prefix': 'prefix',
	'--database-url': 'databaseUrl',
	'--redis-url': 'redisUrl',
};

export function parseCliArgs(argv: string[]): ParseResult {
	const flags: CliFlags = {
		yes: false,
		noGit: false,
		skipInstall: false,
		help: false,
	};

	let projectName: string | undefined;

	for (let index = 0; index < argv.length; index += 1) {
		const token = argv[index];
		if (!token) continue;

		if (token === '--') break;

		if (token === '--help' || token === '-h') {
			flags.help = true;
			continue;
		}

		if (token === '--yes' || token === '-y') {
			flags.yes = true;
			continue;
		}

		if (token === '--no-git') {
			flags.noGit = true;
			continue;
		}

		if (token === '--skip-install') {
			flags.skipInstall = true;
			continue;
		}

		if (token.startsWith('--')) {
			const [name, inlineValue] = token.split('=', 2);
			if (!name || !(name in stringFlagMap)) {
				throw new Error(`Unknown option: ${token}`);
			}

			const flagName = stringFlagMap[name];
			if (!flagName) {
				throw new Error(`Unknown option: ${token}`);
			}

			if (inlineValue !== undefined) {
				flags[flagName] = inlineValue;
				continue;
			}

			const next = argv[index + 1];
			if (!next || next.startsWith('-')) {
				throw new Error(`Missing value for ${name}`);
			}

			flags[flagName] = next;
			index += 1;
			continue;
		}

		if (projectName) {
			throw new Error(`Unexpected extra argument: ${token}`);
		}

		projectName = token;
	}

	return {
		projectName,
		flags,
	};
}

export function formatUsage(): string {
	return [
		'Usage:',
		'  bunx @xirothedev/create-discord-app [project-directory] [options]',
		'',
		'Options:',
		'  --yes, -y                Use defaults and skip prompts',
		'  --no-git                 Skip git initialization',
		'  --skip-install           Skip bun install and prisma generate',
		'  --token <value>          Set TOKEN in .env',
		'  --client-id <value>      Set CLIENT_ID in .env',
		'  --owner <value>          Set OWNER in .env',
		'  --developers <value>     Set DEVELOPERS in .env',
		'  --prefix <value>         Set PREFIX in .env',
		'  --database-url <value>   Set DATABASE_URL in .env',
		'  --redis-url <value>      Set REDIS_URL in .env',
		'  --help, -h               Show this help message',
	].join('\n');
}
