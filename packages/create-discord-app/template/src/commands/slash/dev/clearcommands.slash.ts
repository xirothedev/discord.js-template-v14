/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { MessageFlags, REST, Routes, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import { UseGuards } from '@/decorators/useGuards.decorator';
import { OwnerOnlyGuard } from '@/guards/OwnerOnlyGuard';
import { BaseSlashCommand } from '@/structures/BaseSlashCommand';
import { deploySlashCommands, loadSlashCommands } from '@/handlers/command.handler';
import { DeveloperGuard } from '@/guards/DeveloperGuard';

@UseGuards(OwnerOnlyGuard, DeveloperGuard)
export class ClearcommandsCommand extends BaseSlashCommand {
	data = new SlashCommandBuilder().setName('clearcommands').setDescription('Clear & redeploy all slash commands');

	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });
		const client = this.client;
		const rest = new REST({ version: '10' }).setToken(client.getEnv('TOKEN'));
		const clientId = client.getEnv('CLIENT_ID');
		let clearedGuilds = 0;
		try {
			// Clear global commands
			await rest.put(Routes.applicationCommands(clientId), { body: [] });
			// Clear all guild commands
			const guilds = client.guilds.cache.map((g) => g.id);
			for (const guildId of guilds) {
				await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
				clearedGuilds++;
			}
			// Redeploy
			const loaded = await loadSlashCommands(client);
			await deploySlashCommands(client, loaded);
			await interaction.editReply(
				`🧹 Cleared all global commands and ${clearedGuilds} guilds. Slash commands have been redeployed.`,
			);
		} catch (err) {
			await interaction.editReply('❌ An error occurred while clearing/redeploying commands.');
			throw err;
		}
	}
}
