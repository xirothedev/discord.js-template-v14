/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { UseGuards } from '@/decorators/useGuards.decorator';
import { OwnerOnlyGuard } from '@/guards/OwnerOnlyGuard';
import { BaseSlashCommand } from '@/structures/BaseSlashCommand';
import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

@UseGuards(OwnerOnlyGuard)
export class PingCommand extends BaseSlashCommand {
	data = new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!');

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.reply('🏓 Pong!');
	}
}
