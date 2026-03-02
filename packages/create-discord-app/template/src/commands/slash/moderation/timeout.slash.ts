/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { UseGuards } from '@/decorators/useGuards.decorator';
import { ClientPermissionGuard } from '@/guards/ClientPermissionGuard';
import { PermissionGuard } from '@/guards/PermissionGuard';
import { BaseSlashCommand } from '@/structures/BaseSlashCommand';
import type { BotModule } from '@/types/module';
import { formatDurationFromMs, parseDurationToMs } from '@/utils/duration';
import { MessageFlags, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';

const MAX_TIMEOUT_MS = 28 * 24 * 60 * 60 * 1000;

@UseGuards(PermissionGuard(['ModerateMembers']), ClientPermissionGuard(['ModerateMembers']))
export class TimeoutCommand extends BaseSlashCommand {
	override module: BotModule = 'moderation';
	data = new SlashCommandBuilder()
		.setName('timeout')
		.setDescription('Timeout a guild member')
		.addUserOption((option) => option.setName('user').setDescription('Target user').setRequired(true))
		.addStringOption((option) =>
			option
				.setName('duration')
				.setDescription('Duration in s/m/h/d (e.g. 10m, 2h)')
				.setRequired(true)
				.setMaxLength(8),
		)
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
		const durationInput = interaction.options.getString('duration', true);
		const reason = interaction.options.getString('reason') ?? 'No reason provided';
		const durationMs = parseDurationToMs(durationInput);

		if (!durationMs || durationMs > MAX_TIMEOUT_MS) {
			await interaction.reply({
				content: 'Invalid duration. Use formats like `30m`, `2h`, `1d` up to 28d.',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const member = await interaction.guild.members.fetch(target.id).catch(() => null);
		if (!member) {
			await interaction.reply({
				content: 'Unable to find member in this guild.',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		await member.timeout(durationMs, reason);
		await this.client.prisma.moderationCase.create({
			data: {
				guildId: interaction.guildId,
				userId: target.id,
				moderatorId: interaction.user.id,
				action: 'timeout',
				reason,
				durationMs,
				expiresAt: new Date(Date.now() + durationMs),
			},
		});

		await interaction.reply({
			content: `🔨 Timed out <@${target.id}> for ${formatDurationFromMs(durationMs)}. Reason: ${reason}`,
			flags: MessageFlags.Ephemeral,
		});
	}
}
