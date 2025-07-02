/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getEnvOrThrow } from "@/utils/getEnvOrThrow";
import Redis from "ioredis";

const redis = new Redis({
	host: getEnvOrThrow("REDIS_HOST"),
	port: getEnvOrThrow("REDIS_PORT"),
	password: getEnvOrThrow("REDIS_PASSWORD"),
	db: 0,
});

/**
 * Store a value in Redis with a key and expiration time.
 * @param {string} key - The key to store the value under.
 * @param {string|Object} value - The value to store (will be stringified if an object).
 * @param {number} [expireSeconds=3600] - Expiration time in seconds.
 * @returns {Promise<void>}
 */
export async function setAddition(key: string, value: string | { [x: string]: string }, expireSeconds = 3600) {
	await redis.set(key, JSON.stringify(value), "EX", expireSeconds);
}

/**
 * Retrieve a value from Redis by key. Automatically parses JSON if possible.
 * @param {string} key - The key to retrieve.
 * @returns {Promise<any|null>} - The stored value, or null if not found.
 */
export async function getAddition(key: string) {
	const data = await redis.get(key);
	return data ? JSON.parse(data) : null;
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
	return (await redis.exists(key)) === 1;
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
