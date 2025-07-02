/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import type { Guild, User } from "prisma/generated";

export abstract class BaseSlashCommand {
	abstract data: SlashCommandBuilder;

	constructor(protected client: CustomClient) {
		this.client = client;
	}

	abstract execute(interaction: ChatInputCommandInteraction, guild: Guild | null, user: User): Promise<void>;
}
