/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { RedisClient } from 'bun';
import { getEnvOrThrow } from '@/utils/getEnvOrThrow';

const redis = new RedisClient(getEnvOrThrow('REDIS_URL'));

/**
 * Store a value in Redis with a key and expiration time.
 * Uses MULTI/EXEC transaction to ensure atomicity - either both SET and EXPIRE succeed, or neither does.
 * This prevents keys from being stored without expiration if the process crashes between operations.
 * @param {string} key - The key to store the value under.
 * @param {string|Object} value - The value to store (will be stringified if an object).
 * @param {number} [expireSeconds=3600] - Expiration time in seconds.
 * @returns {Promise<void>}
 */
export async function setAddition(key: string, value: string | { [x: string]: string }, expireSeconds = 3600) {
	// Use MULTI/EXEC transaction for atomic set+expire
	// This prevents the race condition where set succeeds but expire fails
	await redis.send('MULTI', []);
	await redis.send('SET', [key, JSON.stringify(value)]);
	await redis.send('EXPIRE', [key, String(expireSeconds)]);
	await redis.send('EXEC', []);
}

/**
 * Retrieve a value from Redis by key. Automatically parses JSON if possible.
 * @param {string} key - The key to retrieve.
 * @returns {Promise<any|null>} - The stored value, or null if not found or parse error.
 */
export async function getAddition<T>(key: string): Promise<T | null> {
	const data = await redis.get(key);
	if (!data) return null;
	
	try {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return JSON.parse(data);
	} catch (error) {
		console.error(`Redis JSON parse error for key ${key}:`, error);
		return null;
	}
}

/**
 * Delete a key from Redis.
 * @param {string} key - The key to delete.
 * @returns {Promise<void>}
 */
export async function deleteAddition(key: string) {
	await redis.del(key);
}

/**
 * Check if a key exists in Redis.
 * @param {string} key - The key to check.
 * @returns {Promise<boolean>} - True if the key exists, false otherwise.
 */
export async function existsAddition(key: string) {
	// Bun Redis returns boolean directly
	return await redis.exists(key);
}

/**
 * Set a new expiration time for a key.
 * @param {string} key - The key to update TTL for.
 * @param {number} seconds - New TTL in seconds.
 * @returns {Promise<void>}
 */
export async function expireAddition(key: string, seconds: number) {
	await redis.expire(key, seconds);
}

/**
 * Get the remaining time to live (TTL) of a key.
 * @param {string} key - The key to check TTL for.
 * @returns {Promise<number>} - Seconds remaining, -1 if no TTL, -2 if key does not exist.
 */
export async function getTTLAddition(key: string) {
	return await redis.ttl(key); // return seconds
}

/**
 * Get a list of keys matching a pattern.
 * @param {string} pattern - The pattern to match (e.g., "cooldown:*").
 * @returns {Promise<string[]>} - Array of matching keys.
 */
export async function keysAddition(pattern: string) {
	return await redis.keys(pattern);
}