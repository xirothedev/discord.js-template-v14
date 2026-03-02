import { describe, expect, it } from 'bun:test';

import { sanitizeDatabaseName, toValidPackageName } from '../naming';

describe('naming helpers', () => {
	it('sanitizes project names for database names', () => {
		expect(sanitizeDatabaseName('My Bot App')).toBe('my_bot_app');
		expect(sanitizeDatabaseName('discord.js-template-v14')).toBe('discord_js_template_v14');
		expect(sanitizeDatabaseName('---')).toBe('discord_app');
	});

	it('normalizes package names', () => {
		expect(toValidPackageName('My Bot App')).toBe('my-bot-app');
		expect(toValidPackageName('discord_bot')).toBe('discord-bot');
		expect(toValidPackageName('123')).toBe('123');
	});
});
