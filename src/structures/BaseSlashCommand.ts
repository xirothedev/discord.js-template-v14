/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';
import type { Guild, User } from '@prisma/client';
import type { BotModule } from '@/types/module';

export abstract class BaseSlashCommand {
	abstract data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder;
	module: BotModule = 'core';

	constructor(protected client: CustomClient) {}

	abstract execute(interaction: ChatInputCommandInteraction, guild: Guild | undefined, user: User): Promise<void>;
}
