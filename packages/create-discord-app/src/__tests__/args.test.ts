import { describe, expect, it } from 'bun:test';

import { parseCliArgs } from '../args';

describe('parseCliArgs', () => {
	it('parses positional project name and flags', () => {
		const parsed = parseCliArgs([
			'my-bot',
			'--yes',
			'--no-git',
			'--skip-install',
			'--token',
			'abc',
			'--owner',
			'1',
			'--developers',
			'1,2',
			'--prefix',
			'?',
		]);

		expect(parsed.projectName).toBe('my-bot');
		expect(parsed.flags.yes).toBe(true);
		expect(parsed.flags.noGit).toBe(true);
		expect(parsed.flags.skipInstall).toBe(true);
		expect(parsed.flags.token).toBe('abc');
		expect(parsed.flags.owner).toBe('1');
		expect(parsed.flags.developers).toBe('1,2');
		expect(parsed.flags.prefix).toBe('?');
	});

	it('throws for unknown flags', () => {
		expect(() => parseCliArgs(['--wat'])).toThrow('Unknown option: --wat');
	});
});
