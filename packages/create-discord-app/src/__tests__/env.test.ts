import { describe, expect, it } from 'bun:test';

import { buildEnvFile, parseEnvExample } from '../env';

describe('env helpers', () => {
	it('parses key-value entries from .env.example content', () => {
		const parsed = parseEnvExample(`# comment\nTOKEN=token\nCLIENT_ID=abc\n\nPREFIX=s?\n`);
		expect(parsed).toEqual({
			TOKEN: 'token',
			CLIENT_ID: 'abc',
			PREFIX: 's?',
		});
	});

	it('renders env content with overrides while preserving comments and unknown keys', () => {
		const example = `# header\nTOKEN=token\nCLIENT_ID=client_id\nDATABASE_URL=postgresql://default\nOWNER=1\nUNKNOWN=keep\n`;
		const content = buildEnvFile(example, {
			token: '',
			clientId: 'new_client',
			databaseUrl: 'postgresql://generated',
			owner: '999',
			developers: '999',
			prefix: '!',
			redisUrl: 'redis://127.0.0.1:6379/0',
		});

		expect(content).toContain('TOKEN=');
		expect(content).toContain('CLIENT_ID=new_client');
		expect(content).toContain('DATABASE_URL=postgresql://generated');
		expect(content).toContain('OWNER=999');
		expect(content).toContain('DEVELOPERS=999');
		expect(content).toContain('UNKNOWN=keep');
		expect(content).toContain('# header');
	});
});
