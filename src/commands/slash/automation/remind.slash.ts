/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BaseSlashCommand } from '@/structures/BaseSlashCommand';
import type { BotModule } from '@/types/module';
import { parseDurationToMs } from '@/utils/duration';
import { MessageFlags, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';

export class RemindCommand extends BaseSlashCommand {
	override module: BotModule = 'automation';
	data = new SlashCommandBuilder()
		.setName('remind')
		.setDescription('Schedule a reminder message')
		.addStringOption((option) =>
			option.setName('in').setDescription('When to remind (e.g. 10m, 2h, 1d)').setRequired(true).setMaxLength(8),
		)
		.addStringOption((option) =>
			option.setName('message').setDescription('Reminder content').setRequired(true).setMaxLength(500),
		);

	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guildId || !interaction.channelId) {
			await interaction.reply({
				content: 'This command can only be used in a guild text channel.',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const timeInput = interaction.options.getString('in', true);
		const content = interaction.options.getString('message', true);
		const durationMs = parseDurationToMs(timeInput);
		if (!durationMs) {
			await interaction.reply({
				content: 'Invalid duration. Use formats like `10m`, `2h`, `1d`.',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const runAt = new Date(Date.now() + durationMs);
		await this.client.prisma.scheduledJob.create({
			data: {
				guildId: interaction.guildId,
				type: 'reminder',
				status: 'pending',
				runAt,
				payload: {
					channelId: interaction.channelId,
					authorId: interaction.user.id,
					content,
				},
			},
		});

		await interaction.reply({
			content: `⏰ Reminder scheduled for <t:${Math.floor(runAt.getTime() / 1000)}:F>.`,
			flags: MessageFlags.Ephemeral,
		});
	}
}
