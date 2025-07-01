import { UseGuards } from "@/decorators/useGuards.decorator";
import { CooldownGuard } from "@/guards/CooldownGuard";
import { T } from "@/handlers/i18n.handler";
import { BasePrefixCommand } from "@/structures/BasePrefixCommand";
import { EmbedBuilder, type Message } from "discord.js";
import type { Guild, User } from "prisma/generated";

@UseGuards(CooldownGuard(10))
export class PingCommand extends BasePrefixCommand {
	name = "ping";
	description = "command.ping.description";
	aliases = ["pong"];

	async execute(
		message: Message<true>,
		guild: Guild,
		user: User,
		args: string[],
	) {
		const msg = await message.channel.send(T(guild.locale, "ping.checking"));

		const botLatency = msg.createdTimestamp - message.createdTimestamp;
		const apiLatency = Math.round(this.client.ws.ping);

		const botLatencySign = botLatency < 600 ? "+" : "-";
		const apiLatencySign = apiLatency < 500 ? "+" : "-";

		const embed = new EmbedBuilder()
			.setAuthor({
				name: "Pong",
				iconURL: this.client.user?.displayAvatarURL(),
			})
			.setColor(this.client.config.color.main)
			.addFields([
				{
					name: T(guild.locale, "ping.bot_latency"),
					value: `\`\`\`diff\n${botLatencySign} ${botLatency}ms\n\`\`\``,
					inline: true,
				},
				{
					name: T(guild.locale, "ping.api_latency"),
					value: `\`\`\`diff\n${apiLatencySign} ${apiLatency}ms\n\`\`\``,
					inline: true,
				},
			])
			.setFooter({
				text: `@${message.author.username}`,
				iconURL: message.author.displayAvatarURL(),
			})
			.setTimestamp();

		await msg.edit({ content: "", embeds: [embed] });
		return;
	}
}
