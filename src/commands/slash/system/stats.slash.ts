/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { UseGuards } from '@/decorators/useGuards.decorator';
import { DeveloperGuard } from '@/guards/DeveloperGuard';
import { OwnerOnlyGuard } from '@/guards/OwnerOnlyGuard';
import { BaseSlashCommand } from '@/structures/BaseSlashCommand';
import type { BotModule } from '@/types/module';
import { formatDurationFromMs } from '@/utils/duration';
import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';

@UseGuards(OwnerOnlyGuard, DeveloperGuard)
export class StatsCommand extends BaseSlashCommand {
	override module: BotModule = 'observability';
	data = new SlashCommandBuilder().setName('stats').setDescription('Show command usage and runtime stats');

	async execute(interaction: ChatInputCommandInteraction) {
		const snapshot = this.client.metrics.getSnapshot();
		const top = snapshot.commands.slice(0, 10);

		const lines = [
			'**Runtime Stats**',
			`- Uptime: ${formatDurationFromMs(snapshot.uptimeMs)}`,
			`- Guilds: ${this.client.guilds.cache.size}`,
			`- Loaded slash commands: ${this.client.slashCommands.size}`,
			`- Loaded prefix commands: ${this.client.prefixCommands.size}`,
			'',
			'**Top Commands**',
		];

		if (top.length === 0) {
			lines.push('- No command metrics yet');
		} else {
			for (const metric of top) {
				lines.push(
					`- [${metric.source}] ${metric.name}: total=${metric.total}, ok=${metric.success}, fail=${metric.failure}, avg=${metric.avgLatencyMs}ms`,
				);
			}
		}

		await interaction.reply(lines.join('\n'));
	}
}
