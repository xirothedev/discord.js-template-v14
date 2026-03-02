import { describe, expect, test } from 'bun:test';
import { parseDurationToMs } from '@/utils/duration';

describe('duration parser', () => {
	test('parses minute values', () => {
		expect(parseDurationToMs('10m')).toBe(10 * 60_000);
	});

	test('returns null for invalid values', () => {
		expect(parseDurationToMs('abc')).toBeNull();
	});
});
