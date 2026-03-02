/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { UseGuards } from '@/decorators/useGuards.decorator';
import { PermissionGuard } from '@/guards/PermissionGuard';
import { BaseSlashCommand } from '@/structures/BaseSlashCommand';
import type { BotModule } from '@/types/module';
import { MessageFlags, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';

@UseGuards(PermissionGuard(['ManageMessages']))
export class WarnCommand extends BaseSlashCommand {
	override module: BotModule = 'moderation';
	data = new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Warn a user and persist the moderation case')
		.addUserOption((option) => option.setName('user').setDescription('User to warn').setRequired(true))
		.addStringOption((option) => option.setName('reason').setDescription('Warning reason').setMaxLength(512));

	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guildId) {
			await interaction.reply({
				content: 'This command can only be used in a guild.',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const target = interaction.options.getUser('user', true);
		const reason = interaction.options.getString('reason') ?? 'No reason provided';
		const guild = await this.client.entityAccess.getOrCreateGuild(interaction.guildId);

		await this.client.prisma.moderationCase.create({
			data: {
				guildId: guild.id,
				userId: target.id,
				moderatorId: interaction.user.id,
				action: 'warn',
				reason,
			},
		});

		await interaction.reply({
			content: `⚠️ Warned <@${target.id}>. Reason: ${reason}`,
			flags: MessageFlags.Ephemeral,
		});
	}
}
