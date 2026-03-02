/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getEnvOrThrow } from './getEnvOrThrow';

const truthy = new Set(['1', 'true', 'yes', 'on']);
const falsy = new Set(['0', 'false', 'no', 'off']);

export function getEnvBoolean(key: string, fallback: boolean): boolean {
	const raw = process.env[key];
	if (!raw) return fallback;

	const normalized = raw.trim().toLowerCase();
	if (truthy.has(normalized)) return true;
	if (falsy.has(normalized)) return false;

	return fallback;
}

export function getEnvNumber(key: string, fallback: number): number {
	const raw = process.env[key];
	if (!raw) return fallback;

	const parsed = Number(raw);
	return Number.isFinite(parsed) ? parsed : fallback;
}

export function getEnvString(key: string, fallback?: string): string {
	const value = process.env[key];
	if (value && value.trim() !== '') {
		return value;
	}

	if (fallback !== undefined) return fallback;
	return getEnvOrThrow(key);
}
