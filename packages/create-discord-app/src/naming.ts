const DEFAULT_DATABASE_NAME = 'discord_app';
const DEFAULT_PACKAGE_NAME = 'discord-app';

export function sanitizeDatabaseName(projectName: string): string {
	const normalized = projectName
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/^_+|_+$/g, '')
		.slice(0, 63);

	return normalized || DEFAULT_DATABASE_NAME;
}

export function toValidPackageName(projectName: string): string {
	const normalized = projectName
		.trim()
		.toLowerCase()
		.replace(/[\s_]+/g, '-')
		.replace(/[^a-z0-9-]/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '');

	return normalized || DEFAULT_PACKAGE_NAME;
}

export function buildDefaultDatabaseUrl(projectName: string): string {
	const dbName = sanitizeDatabaseName(projectName);
	return `postgresql://postgres:postgres@localhost:5432/${dbName}`;
}
