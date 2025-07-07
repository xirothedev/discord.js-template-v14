/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { ClientEvents } from 'discord.js';

export abstract class BaseEvent<T extends keyof ClientEvents> {
	constructor(
		protected client: CustomClient,
		public name: T,
		public once = false,
	) {}

	abstract execute(...args: ClientEvents[T]): Promise<void> | void;
}
