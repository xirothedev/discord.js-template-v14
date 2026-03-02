/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getGuards } from '@/decorators/useGuards.decorator';
import { T } from '@/handlers/i18n.handler';
import { BaseEvent } from '@/structures/BaseEvent';
import type { CommandContext } from '@/structures/Guard';
import { getPrefixCommand } from '@/utils/getPrefixCommand';
import { userMention, type Message } from 'discord.js';
import type { Guild } from '@prisma/client';

export class MessageCreateEvent extends BaseEvent<'messageCreate'> {
	constructor(client: CustomClient) {
		super(client, 'messageCreate');
	}

	async execute(message: Message<boolean>) {
		if (message.author.bot || !message.inGuild()) return;
		if (!this.client.user) return;

		let commandInput: string | undefined;
		let guild: Guild | undefined;
		let startedAt = Date.now();
		const defaultPrefix = this.client.getEnv<string>('PREFIX');
		const mentionPrefix = userMention(this.client.user.id);
		const normalizedContent = message.content.toLowerCase();
		const maybeDefaultPrefix = normalizedContent.startsWith(defaultPrefix.toLowerCase());
		const maybeMentionPrefix = message.content.startsWith(mentionPrefix);
		const maybeCustomPrefixCandidate = /^[^\w\s]/.test(message.content);

		// Avoid DB writes/lookups for clearly non-command messages.
		if (!maybeDefaultPrefix && !maybeMentionPrefix && !maybeCustomPrefixCandidate) {
			return;
		}

		const replyError = async (locale: string) => {
			await message.reply(T(locale, 'error'));
		};

		try {
			guild = await this.client.entityAccess.getOrCreateGuild(message.guildId);

			const result = getPrefixCommand(message.content, guild, {
				defaultPrefix,
				mentionUserId: this.client.user.id,
			});
			if (!result) return;

			commandInput = result.commandInput;
			const { args } = result;

			const command =
				this.client.prefixCommands.get(commandInput) ||
				this.client.prefixCommands.find((cmd) => cmd.aliases?.includes(commandInput!));

			if (!command) return;
			startedAt = Date.now();

			const isModuleEnabled = await this.client.moduleSettings.isEnabled(guild.id, command.module);
			if (!isModuleEnabled) {
				await message.reply(T(guild.locale, 'module_disabled', { module: command.module }));
				return;
			}

			const user = await this.client.entityAccess.getOrCreateUser(message.author.id);

			// ----- Guard check -----
			const guards = getGuards(Object.getPrototypeOf(command).constructor);
			const context: CommandContext = { message, guild, user, args };

			for (const guard of guards) {
				const result = await guard(context);
				if (!result.success) {
					await message.reply(result.message ?? T(guild.locale, 'error'));
					return;
				}
			}

			// ----- Run command -----
			await command.execute(message, guild, user, args);
			this.client.metrics.record(command.name, 'prefix', Date.now() - startedAt, true);
		} catch (err) {
			if (commandInput) this.client.metrics.record(commandInput, 'prefix', Date.now() - startedAt, false);
			console.error(`❌ Error running command ${commandInput}:`, err);
			await replyError(guild?.locale || 'EnglishUS');
		}
	}
}
