/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getGuards } from '@/decorators/useGuards.decorator';
import { T } from '@/handlers/i18n.handler';
import { BaseEvent } from '@/structures/BaseEvent';
import type { CommandContext } from '@/structures/Guard';
import { getPrefixCommand } from '@/utils/getPrefixCommand';
import type { Message } from 'discord.js';
import type { Guild } from 'prisma/generated';

export class MessageCreateEvent extends BaseEvent<'messageCreate'> {
	constructor(client: CustomClient) {
		super(client, 'messageCreate');
	}

	async execute(message: Message<boolean>) {
		if (message.author.bot || !message.inGuild()) return;
		let commandInput: string | undefined;
		let guild: Guild | undefined;

		const replyError = async (locale: string) => {
			await message.reply(T(locale, 'error'));
		};

		try {
			guild = await this.client.prisma.guild.upsert({
				where: { id: message.guildId },
				create: { id: message.guildId },
				update: {},
			});

			const result = getPrefixCommand(message.content, guild);
			if (!result) return;

			commandInput = result.commandInput;
			const { args } = result;

			const command =
				this.client.prefixCommands.get(commandInput) ||
				this.client.prefixCommands.find((cmd) => cmd.aliases?.includes(commandInput!));

			if (!command) return;

			const user = await this.client.prisma.user.upsert({
				where: { id: message.author.id },
				create: { id: message.author.id },
				update: {},
			});

			// ----- Guard check -----
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
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
		} catch (err) {
			console.error(`❌ Error running command ${commandInput}:`, err);
			await replyError(guild?.locale || 'EnglishUS');
		}
	}
}
