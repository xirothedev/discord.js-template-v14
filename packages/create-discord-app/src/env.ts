import type { PromptValues } from './types';

const ENV_KEYS: Array<keyof PromptValues> = [
	'token',
	'clientId',
	'owner',
	'developers',
	'prefix',
	'databaseUrl',
	'redisUrl',
];

const ENV_NAME_MAP: Record<keyof PromptValues, string> = {
	token: 'TOKEN',
	clientId: 'CLIENT_ID',
	owner: 'OWNER',
	developers: 'DEVELOPERS',
	prefix: 'PREFIX',
	databaseUrl: 'DATABASE_URL',
	redisUrl: 'REDIS_URL',
};

export function parseEnvExample(content: string): Record<string, string> {
	const output: Record<string, string> = {};

	for (const rawLine of content.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line || line.startsWith('#')) continue;

		const separatorIndex = line.indexOf('=');
		if (separatorIndex <= 0) continue;

		const key = line.slice(0, separatorIndex).trim();
		const value = line.slice(separatorIndex + 1).trim();
		output[key] = value;
	}

	return output;
}

export function toEnvRecord(values: PromptValues): Record<string, string> {
	const envRecord: Record<string, string> = {};
	for (const key of ENV_KEYS) {
		envRecord[ENV_NAME_MAP[key]] = values[key];
	}
	return envRecord;
}

export function buildEnvFile(exampleContent: string, values: PromptValues): string {
	const valueMap = toEnvRecord(values);
	const lines = exampleContent.split(/\r?\n/);
	const seen = new Set<string>();

	const mapped = lines.map((line) => {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith('#')) return line;

		const separatorIndex = line.indexOf('=');
		if (separatorIndex <= 0) return line;

		const key = line.slice(0, separatorIndex).trim();
		seen.add(key);
		if (!(key in valueMap)) return line;

		return `${key}=${valueMap[key]}`;
	});

	for (const [key, value] of Object.entries(valueMap)) {
		if (!seen.has(key)) {
			mapped.push(`${key}=${value}`);
		}
	}

	return `${mapped.join('\n').replace(/\n+$/g, '')}\n`;
}
