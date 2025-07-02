/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Message } from "discord.js";
import type { Guild, User } from "prisma/generated";

export abstract class BasePrefixCommand {
	abstract name: string;
	abstract description: string;
	abstract aliases?: string[];

	constructor(protected client: CustomClient) {
		this.client = client;
	}

	abstract execute(message: Message<true>, guild: Guild, user: User, args: string[]): Promise<void>;
}
