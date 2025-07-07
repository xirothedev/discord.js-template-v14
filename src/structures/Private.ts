/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import 'reflect-metadata';

const PRIVATE_GUILD_KEY = Symbol('PRIVATE_GUILD_ID');

export function Private(guildId: string) {
	return (target: Object) => {
		Reflect.defineMetadata(PRIVATE_GUILD_KEY, guildId, target);
	};
}

export function getPrivateGuildId(target: Object): string | null {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return Reflect.getMetadata(PRIVATE_GUILD_KEY, target) ?? null;
}
