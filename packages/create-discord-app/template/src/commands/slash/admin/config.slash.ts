/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { UseGuards } from '@/decorators/useGuards.decorator';
import { PermissionGuard } from '@/guards/PermissionGuard';
import { BaseSlashCommand } from '@/structures/BaseSlashCommand';
import { BOT_MODULES, type BotModule } from '@/types/module';
import { MessageFlags, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import { Language } from '@prisma/client';

const localeOptions = [
	{ name: 'English (US)', value: Language.EnglishUS },
	{ name: 'Vietnamese', value: Language.Vietnamese },
];

const moduleChoices = BOT_MODULES.filter((module) => module !== 'core').map((module) => ({
	name: module,
	value: module,
}));

@UseGuards(PermissionGuard(['Administrator']))
export class ConfigCommand extends BaseSlashCommand {
	data = new SlashCommandBuilder()
		.setName('config')
		.setDescription('Manage guild-level bot configuration')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('prefix')
				.setDescription('Update guild prefix')
				.addStringOption((option) =>
					option
						.setName('value')
						.setDescription('New prefix')
						.setRequired(true)
						.setMinLength(1)
						.setMaxLength(8),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('locale')
				.setDescription('Update guild locale')
				.addStringOption((option) =>
					localeOptions.reduce(
						(acc, item) => acc.addChoices({ name: item.name, value: item.value }),
						option.setName('value').setDescription('Locale').setRequired(true),
					),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('module')
				.setDescription('Enable or disable a feature module')
				.addStringOption((option) =>
					moduleChoices.reduce(
						(acc, item) => acc.addChoices({ name: item.name, value: item.value }),
						option.setName('name').setDescription('Module').setRequired(true),
					),
				)
				.addBooleanOption((option) =>
					option.setName('enabled').setDescription('Whether the module should be enabled').setRequired(true),
				),
		);

	async execute(interaction: ChatInputCommandInteraction) {
		if (!interaction.guildId) {
			await interaction.reply({
				content: 'This command can only be used in a guild.',
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const subcommand = interaction.options.getSubcommand(true);
		const guild = await this.client.entityAccess.getOrCreateGuild(interaction.guildId);

		if (subcommand === 'prefix') {
			const prefix = interaction.options.getString('value', true).trim();
			const updated = await this.client.prisma.guild.update({
				where: { id: guild.id },
				data: { prefix },
			});
			await this.client.entityAccess.updateGuildCache(updated);
			await interaction.reply({
				content: `✅ Updated prefix to \`${prefix}\``,
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		if (subcommand === 'locale') {
			const locale = interaction.options.getString('value', true) as Language;
			const updated = await this.client.prisma.guild.update({
				where: { id: guild.id },
				data: { locale },
			});
			await this.client.entityAccess.updateGuildCache(updated);
			await interaction.reply({
				content: `✅ Updated locale to \`${locale}\``,
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const moduleName = interaction.options.getString('name', true) as BotModule;
		const enabled = interaction.options.getBoolean('enabled', true);
		await this.client.moduleSettings.setEnabled(guild.id, moduleName, enabled);
		await interaction.reply({
			content: `✅ Module \`${moduleName}\` is now ${enabled ? 'enabled' : 'disabled'}.`,
			flags: MessageFlags.Ephemeral,
		});
	}
}
