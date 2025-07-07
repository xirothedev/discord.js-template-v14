/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import type { Guild, User } from 'prisma/generated';

export abstract class BaseSlashCommand {
	abstract data: SlashCommandBuilder;

	constructor(protected client: CustomClient) {}

	abstract execute(interaction: ChatInputCommandInteraction, guild: Guild | undefined, user: User): Promise<void>;
}
