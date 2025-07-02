/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/** biome-ignore-all lint/suspicious/noExplicitAny: handle decorator */
import "reflect-metadata";

const PRIVATE_GUILD_KEY = Symbol("PRIVATE_GUILD_ID");

export function Private(guildId: string) {
	return (target: any) => {
		Reflect.defineMetadata(PRIVATE_GUILD_KEY, guildId, target);
	};
}

export function getPrivateGuildId(target: any): string | null {
	return Reflect.getMetadata(PRIVATE_GUILD_KEY, target) ?? null;
}
