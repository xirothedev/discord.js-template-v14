/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { UseGuards } from '@/decorators/useGuards.decorator';
import { ClientPermissionGuard } from '@/guards/ClientPermissionGuard';
import { PermissionGuard } from '@/guards/PermissionGuard';
import { BaseSlashCommand } from '@/structures/BaseSlashCommand';
import type { BotModule } from '@/types/module';
import { MessageFlags, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';

@UseGuards(PermissionGuard(['ModerateMembers']), ClientPermissionGuard(['ModerateMembers']))
export class UntimeoutCommand extends BaseSlashCommand {
	override module: BotModule = 'moderation';
	data = new SlashCommandBuilder()
		.setName('untimeout')
		.setDescription('Remove timeout from a guild member')
		.addUserOption((option) => option.setName('user').setDescription('Target user').setRequired(true))
		.addStringOption((option) => option.setName('reason').setDescription('Reason').setMaxLength(512));

	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guildId || !interaction.guild) {
			await interaction.reply({
				content: 'This command can only be used in a guild.',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const target = interaction.options.getUser('user', true);
		const reason = interaction.options.getString('reason') ?? 'No reason provided';
		const member = await interaction.guild.members.fetch(target.id).catch(() => null);
		if (!member) {
			await interaction.reply({
				content: 'Unable to find member in this guild.',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		await member.timeout(null, reason);
		await this.client.prisma.moderationCase.create({
			data: {
				guildId: interaction.guildId,
				userId: target.id,
				moderatorId: interaction.user.id,
				action: 'untimeout',
				reason,
				resolvedAt: new Date(),
			},
		});

		await interaction.reply({
			content: `✅ Removed timeout for <@${target.id}>. Reason: ${reason}`,
			flags: MessageFlags.Ephemeral,
		});
	}
}
