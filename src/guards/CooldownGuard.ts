import { T } from "@/handlers/i18n.handler";
import type { CommandContext } from "@/structures/Guard";
import { getPrefixCommand } from "@/utils/getPrefixCommand";

const cooldowns = new Map<string, number>();

export function CooldownGuard(seconds: number) {
	return ({ interaction, message, guild }: CommandContext) => {
		const userId = interaction?.user.id || message?.author.id;
		let commandName: string;

		if (interaction?.commandName) {
			commandName = interaction.commandName;
		} else if (message?.content) {
			const result = getPrefixCommand(message.content, guild);
			if (!result) {
				return {
					success: false,
					message: T(guild?.locale || "EnglishUS", "error"),
				};
			}

			commandName = result?.commandInput;
		} else {
			return {
				success: false,
				message: T(guild?.locale || "EnglishUS", "error"),
			};
		}

		const key = `${userId}:${commandName}`;

		const now = Date.now();
		const expiresAt = cooldowns.get(key) || 0;

		if (now < expiresAt) {
			const remaining = Math.ceil((expiresAt - now) / 1000);
			return {
				success: false,
				message: T(guild?.locale || "EnglishUS", "guard.cooldown", { ns: "guards", seconds: remaining.toString() }),
			};
		} else if (expiresAt) {
			cooldowns.delete(key);
		}

		cooldowns.set(key, now + seconds * 1000);

		return { success: true };
	};
}

setInterval(() => {
	const now = Date.now();
	for (const [key, expiresAt] of cooldowns.entries()) {
		if (expiresAt < now) {
			cooldowns.delete(key);
		}
	}
}, 60 * 1000);
