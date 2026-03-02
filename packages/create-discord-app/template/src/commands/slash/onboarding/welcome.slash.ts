/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { UseGuards } from '@/decorators/useGuards.decorator';
import { PermissionGuard } from '@/guards/PermissionGuard';
import { BaseSlashCommand } from '@/structures/BaseSlashCommand';
import type { BotModule } from '@/types/module';
import { ChannelType, MessageFlags, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';

@UseGuards(PermissionGuard(['Administrator']))
export class WelcomeCommand extends BaseSlashCommand {
	override module: BotModule = 'onboarding';
	data = new SlashCommandBuilder()
		.setName('welcome')
		.setDescription('Configure welcome message and auto-role onboarding')
		.addBooleanOption((option) =>
			option.setName('enabled').setDescription('Enable or disable onboarding welcome flow').setRequired(true),
		)
		.addChannelOption((option) =>
			option
				.setName('channel')
				.setDescription('Channel to send welcome messages')
				.addChannelTypes(ChannelType.GuildText),
		)
		.addStringOption((option) =>
			option.setName('template').setDescription('Welcome template. Use {user} and {guild}').setMaxLength(500),
		)
		.addStringOption((option) =>
			option.setName('autoroles').setDescription('Comma-separated role IDs to grant on join').setMaxLength(300),
		);

	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guildId) {
			await interaction.reply({
				content: 'This command can only be used in a guild.',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const enabled = interaction.options.getBoolean('enabled', true);
		const channel = interaction.options.getChannel('channel');
		const template =
			interaction.options.getString('template') ?? 'Welcome {user} to **{guild}**! Please read the server rules.';
		const autoRoleIds = interaction.options.getString('autoroles') ?? '';

		await this.client.prisma.welcomeSetting.upsert({
			where: { guildId: interaction.guildId },
			create: {
				guildId: interaction.guildId,
				enabled,
				channelId: channel?.id ?? null,
				template,
				autoRoleIds,
				verificationMode: 'none',
			},
			update: {
				enabled,
				channelId: channel?.id ?? null,
				template,
				autoRoleIds,
			},
		});

		await interaction.reply({
			content: `✅ Welcome settings updated. Enabled=${enabled}`,
			flags: MessageFlags.Ephemeral,
		});
	}
}
