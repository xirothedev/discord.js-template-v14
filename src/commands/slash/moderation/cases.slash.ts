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
export class CasesCommand extends BaseSlashCommand {
	override module: BotModule = 'moderation';
	data = new SlashCommandBuilder()
		.setName('cases')
		.setDescription('List recent moderation cases for a user')
		.addUserOption((option) => option.setName('user').setDescription('Target user').setRequired(true));

	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guildId) {
			await interaction.reply({
				content: 'This command can only be used in a guild.',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const target = interaction.options.getUser('user', true);
		const cases = await this.client.prisma.moderationCase.findMany({
			where: {
				guildId: interaction.guildId,
				userId: target.id,
			},
			orderBy: {
				createdAt: 'desc',
			},
			take: 10,
		});

		if (cases.length === 0) {
			await interaction.reply({
				content: `No moderation cases found for <@${target.id}>.`,
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const lines = cases.map((item, index) => {
			return `${index + 1}. [${item.action}] ${item.reason ?? 'No reason'} - <t:${Math.floor(item.createdAt.getTime() / 1000)}:R>`;
		});

		await interaction.reply({
			content: `Recent cases for <@${target.id}>:\n${lines.join('\n')}`,
			flags: MessageFlags.Ephemeral,
		});
	}
}
