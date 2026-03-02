/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

const UNIT_TO_MS: Record<string, number> = {
	s: 1000,
	m: 60_000,
	h: 3_600_000,
	d: 86_400_000,
};

export function parseDurationToMs(input: string): number | null {
	const normalized = input.trim().toLowerCase();
	const match = normalized.match(/^(\d+)([smhd])$/);
	if (!match) return null;

	const amount = Number(match[1]);
	const unit = match[2] as keyof typeof UNIT_TO_MS;
	const multiplier = UNIT_TO_MS[unit];
	if (!Number.isFinite(amount) || amount <= 0 || !multiplier) return null;

	return amount * multiplier;
}

export function formatDurationFromMs(ms: number): string {
	if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
	if (ms < 3_600_000) return `${Math.round(ms / 60_000)}m`;
	if (ms < 86_400_000) return `${Math.round(ms / 3_600_000)}h`;
	return `${Math.round(ms / 86_400_000)}d`;
}
