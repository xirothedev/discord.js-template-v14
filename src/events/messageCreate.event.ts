/** biome-ignore-all lint/style/noNonNullAssertion: find command */
import { getGuards } from "@/decorators/useGuards.decorator";
import { T } from "@/handlers/i18n.handler";
import { BaseEvent } from "@/structures/BaseEvent";
import type { CommandContext } from "@/structures/Guard";
import { getPrefixCommand } from "@/utils/getPrefixCommand";
import type { Message } from "discord.js";
import type { Guild } from "prisma/generated";

export class MessageCreateEvent extends BaseEvent<"messageCreate"> {
	constructor(client: CustomClient) {
		super(client, "messageCreate");
	}

	async execute(message: Message<boolean>) {
		if (message.author.bot || !message.inGuild()) return;
		let commandInput: string | undefined;
		let guild: Guild | undefined;

		try {
			const guild = await this.client.prisma.guild.upsert({
				where: { id: message.guildId },
				create: { id: message.guildId },
				update: {},
			});

			const result = getPrefixCommand(message.content, guild);
			if (!result) return;

			commandInput = result.commandInput;
			const { args } = result;

			const command =
				this.client.prefixCommands.get(commandInput!) ||
				this.client.prefixCommands.find((cmd) => cmd.aliases?.includes(commandInput!));

			if (!command) return;

			const user = await this.client.prisma.user.upsert({
				where: { id: message.author.id },
				create: { id: message.author.id },
				update: {},
			});

			// ----- Guard check -----
			const guards = getGuards(Object.getPrototypeOf(command).constructor);
			const context: CommandContext = { message };

			for (const guard of guards) {
				const result = await guard(context);
				if (!result.success) {
					await message.reply(result.message ?? T("error", guild.locale));
					return;
				}
			}

			// ----- Run command -----
			await command.execute(message, guild, user, args);
		} catch (err) {
			console.error(`❌ Error running command ${commandInput}:`, err);
			await message.reply(T(guild?.locale!, "error"));
		}
	}
}
