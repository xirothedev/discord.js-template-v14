import type { Message, ChatInputCommandInteraction } from "discord.js";
import type { Guild, User } from "prisma/generated";

export type CommandContext = {
	interaction?: ChatInputCommandInteraction;
	message?: Message;
	args?: string[];
	guild?: Guild;
	user?: User;
};

export type GuardResult = {
	success: boolean;
	message?: string;
};

export type Guard = (context: CommandContext) => Promise<GuardResult> | GuardResult;
