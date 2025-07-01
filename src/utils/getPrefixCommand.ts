import { userMention } from "discord.js";
import { client } from "..";
import type { Guild } from "prisma/generated";

export function getPrefixCommand(content: string, guild?: Guild) {
	let prefix: string;

	if (content.toLowerCase().startsWith(guild?.prefix?.toLowerCase() || client.getEnv("PREFIX").toLowerCase())) {
		prefix = client.getEnv("PREFIX");
	} else if (client.user && content.startsWith(userMention(client.user.id))) {
		prefix = userMention(client.user.id);
	} else {
		return null;
	}

	const args = content.slice(prefix.length).trim().split(/ +/g);
	const commandInput = args.shift()?.toLowerCase();

	if(!commandInput) {
		return null
	}

	return { prefix, commandInput, args };
}