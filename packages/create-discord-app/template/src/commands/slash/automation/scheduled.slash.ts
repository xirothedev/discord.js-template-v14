/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { BaseSlashCommand } from '@/structures/BaseSlashCommand';
import type { BotModule } from '@/types/module';
import { MessageFlags, SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';

export class ScheduledCommand extends BaseSlashCommand {
	override module: BotModule = 'automation';
	data = new SlashCommandBuilder()
		.setName('scheduled')
		.setDescription('Inspect or cancel scheduled jobs')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('list')
				.setDescription('List upcoming jobs')
				.addIntegerOption((option) =>
					option.setName('limit').setDescription('Number of jobs to show').setMinValue(1).setMaxValue(20),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('cancel')
				.setDescription('Cancel a job by id')
				.addStringOption((option) => option.setName('id').setDescription('Job id').setRequired(true)),
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
		if (subcommand === 'list') {
			const limit = interaction.options.getInteger('limit') ?? 10;
			const jobs = await this.client.prisma.scheduledJob.findMany({
				where: {
					guildId: interaction.guildId,
					status: {
						in: ['pending', 'retry', 'running'],
					},
				},
				orderBy: {
					runAt: 'asc',
				},
				take: limit,
			});

			if (jobs.length === 0) {
				await interaction.reply({
					content: 'No scheduled jobs found.',
					flags: MessageFlags.Ephemeral,
				});
				return;
			}

			const lines = jobs.map((job) => {
				return `- \`${job.id}\` [${job.status}] type=${job.type} at <t:${Math.floor(job.runAt.getTime() / 1000)}:F>`;
			});

			await interaction.reply({
				content: `Upcoming jobs:\n${lines.join('\n')}`,
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const id = interaction.options.getString('id', true);
		const result = await this.client.prisma.scheduledJob.updateMany({
			where: {
				id,
				guildId: interaction.guildId,
				status: {
					in: ['pending', 'retry', 'running'],
				},
			},
			data: {
				status: 'cancelled',
			},
		});

		await interaction.reply({
			content: result.count > 0 ? `✅ Cancelled job \`${id}\`.` : `No cancellable job found for \`${id}\`.`,
			flags: MessageFlags.Ephemeral,
		});
	}
}
