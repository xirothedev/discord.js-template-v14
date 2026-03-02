/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { UseGuards } from '@/decorators/useGuards.decorator';
import { DeveloperGuard } from '@/guards/DeveloperGuard';
import { OwnerOnlyGuard } from '@/guards/OwnerOnlyGuard';
import { pingRedis } from '@/store/redisStore';
import { BaseSlashCommand } from '@/structures/BaseSlashCommand';
import type { BotModule } from '@/types/module';
import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';

@UseGuards(OwnerOnlyGuard, DeveloperGuard)
export class HealthCommand extends BaseSlashCommand {
	override module: BotModule = 'observability';
	data = new SlashCommandBuilder().setName('health').setDescription('Check runtime health for bot dependencies');

	async execute(interaction: ChatInputCommandInteraction) {
		const startedAt = Date.now();

		let dbOk = false;
		let redisOk = false;

		try {
			await this.client.prisma.$queryRawUnsafe('SELECT 1');
			dbOk = true;
		} catch {
			dbOk = false;
		}

		redisOk = await pingRedis();
		const totalMs = Date.now() - startedAt;

		await interaction.reply(
			[
				'**Health Check**',
				`- Database: ${dbOk ? 'ok' : 'failed'}`,
				`- Redis: ${redisOk ? 'ok' : 'failed'}`,
				`- Total: ${totalMs}ms`,
			].join('\n'),
		);
	}
}
