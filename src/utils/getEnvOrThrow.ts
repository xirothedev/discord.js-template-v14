/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export function getEnvOrThrow<T = string>(key: string): T {
	const value = process.env[key];

	if (!value || value.trim() === "") {
		throw new Error(`❌ Missing environment variable: ${key}`);
	}

	return value as T;
}
