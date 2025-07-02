/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getGuards } from "@/decorators/useGuards.decorator";
import { T } from "@/handlers/i18n.handler";
import { client } from "@/index";
import { BaseEvent } from "@/structures/BaseEvent";
import type { CommandContext } from "@/structures/Guard";
import { MessageFlags, type CacheType, type Interaction } from "discord.js";
import type { Guild, User } from "prisma/generated";

export class InteractionCreateEvent extends BaseEvent<"interactionCreate"> {
	constructor(client: CustomClient) {
		super(client, "interactionCreate");
	}

	async execute(interaction: Interaction<CacheType>) {
		if (!interaction.isChatInputCommand()) return;

		const command = client.slashCommands.get(interaction.commandName);
		if (!command) return;

		let guild: Guild | undefined;
		let user: User;

		const replyError = async (locale: string) => {
			const errorMsg = T(locale, "error");
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: errorMsg,
					flags: MessageFlags.Ephemeral,
				});
			} else {
				await interaction.reply({
					content: errorMsg,
					flags: MessageFlags.Ephemeral,
				});
			}
		};

		try {
			if (interaction.guildId) {
				guild = await this.client.prisma.guild.upsert({
					where: { id: interaction.guildId },
					create: { id: interaction.guildId },
					update: {},
				});
			}

			user = await this.client.prisma.user.upsert({
				where: { id: interaction.user.id },
				create: { id: interaction.user.id },
				update: {},
			});
		} catch (error) {
			console.error(`❌ error upserting user/guild:`, error);
			await replyError(guild?.locale || "EnglishUS");
			return;
		}

		try {
			// ----- Guard check -----
			const guards = getGuards(Object.getPrototypeOf(command).constructor);
			const context: CommandContext = { interaction, guild, user };

			for (const guard of guards) {
				const result = await guard(context);
				if (!result.success) {
					await interaction.reply({
						content: result.message ?? T(guild?.locale || "EnglishUS", "error"),
						flags: MessageFlags.Ephemeral,
					});
					return;
				}
			}

			// ----- Run command -----
			await command.execute(interaction, guild, user);
		} catch (error) {
			console.error(`❌ error running slash command ${interaction.commandName}:`, error);
			await replyError(guild?.locale || "EnglishUS");
		}
	}
}
