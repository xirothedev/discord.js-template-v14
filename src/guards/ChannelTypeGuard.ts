import { ChannelType } from "discord.js";
import type { CommandContext, Guard } from "@/structures/Guard";
import { T } from "@/handlers/i18n.handler";

export function ChannelTypeGuard(allowedTypes: (keyof typeof ChannelType)[]): Guard {
	return ({ message, interaction, guild }: CommandContext) => {
		const channel = message?.channel || interaction?.channel;
		if (!channel) {
			return {
				success: false,
				message: T(guild?.locale!, "error"),
			};
		}

		const currentType = channel.type;
		const allowedValues = allowedTypes.map((t) => ChannelType[t]);

		if (!allowedValues.includes(currentType)) {
			return {
				success: false,
				message: T(guild?.locale!, "error"),
			};
		}

		return { success: true };
	};
}
