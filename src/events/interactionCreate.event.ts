import { getGuards } from "@/decorators/useGuards.decorator";
import { T } from "@/handlers/i18n.handler";
import { client } from "@/index";
import { BaseEvent } from "@/structures/BaseEvent";
import type { CommandContext } from "@/structures/Guard";
import { MessageFlags, type CacheType, type Interaction } from "discord.js";
import type { Guild } from "prisma/generated";

export class InteractionCreateEvent extends BaseEvent<"interactionCreate"> {
	constructor(client: CustomClient) {
		super(client, "interactionCreate");
	}

	async execute(interaction: Interaction<CacheType>) {
		if (!interaction.isChatInputCommand()) return;

		const command = client.slashCommands.get(interaction.commandName);
		if (!command) return;

		let guild: Guild | null = null;

		try {
			if (interaction.guildId) {
				guild = await this.client.prisma.guild.upsert({
					where: { id: interaction.guildId },
					create: { id: interaction.guildId },
					update: {},
				});
			}

			// ----- Guard check -----
			const guards = getGuards(Object.getPrototypeOf(command).constructor);
			const context: CommandContext = { interaction };

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

			const user = await this.client.prisma.user.upsert({
				where: { id: interaction.user.id },
				create: { id: interaction.user.id },
				update: {},
			});

			// ----- Run command -----
			return await command.execute(interaction, guild, user);
		} catch (error) {
			console.error(`❌ error running slash command ${interaction.commandName}:`, error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: T(guild?.locale || "EnglishUS", "error"),
					flags: MessageFlags.Ephemeral,
				});
			} else {
				await interaction.reply({
					content: T(guild?.locale || "EnglishUS", "error"),
					flags: MessageFlags.Ephemeral,
				});
			}
		}
	}
}
