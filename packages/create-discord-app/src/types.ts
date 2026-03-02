export interface CliFlags {
	yes: boolean;
	noGit: boolean;
	skipInstall: boolean;
	help: boolean;
	token?: string;
	clientId?: string;
	owner?: string;
	developers?: string;
	prefix?: string;
	databaseUrl?: string;
	redisUrl?: string;
}

export interface ParseResult {
	projectName?: string;
	flags: CliFlags;
}

export interface PromptValues {
	token: string;
	clientId: string;
	owner: string;
	developers: string;
	prefix: string;
	databaseUrl: string;
	redisUrl: string;
}
