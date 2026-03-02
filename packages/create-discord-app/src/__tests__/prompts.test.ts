import { describe, expect, it } from 'bun:test';

import { collectPromptValues } from '../prompts';

describe('collectPromptValues', () => {
	it('keeps defaults in --yes mode when overrides are undefined', async () => {
		const values = await collectPromptValues({
			defaults: {
				token: '',
				clientId: '',
				owner: '123',
				developers: '123',
				prefix: 's?',
				databaseUrl: 'postgresql://postgres:postgres@localhost:5432/my_bot',
				redisUrl: 'redis://127.0.0.1:6379/0',
			},
			overrides: {
				token: undefined,
				owner: undefined,
			},
			yes: true,
		});

		expect(values.owner).toBe('123');
		expect(values.developers).toBe('123');
	});
});
