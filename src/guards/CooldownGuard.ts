import { T } from "@/handlers/i18n.handler";
import type { CommandContext } from "@/structures/Guard";
import { getPrefixCommand } from "@/utils/getPrefixCommand";
import { getAddition, setAddition, deleteAddition } from "@/store/redisStore";

export function CooldownGuard(seconds: number) {
	return async ({ interaction, message, guild }: CommandContext) => {
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

		const key = `cooldown:${userId}:${commandName}`;

		const now = Date.now();
		const expiresAt = (await getAddition(key)) || 0;

		if (now < expiresAt) {
			const remaining = Math.ceil((expiresAt - now) / 1000);
			return {
				success: false,
				message: T(guild?.locale || "EnglishUS", "guard.cooldown", { ns: "guards", seconds: remaining.toString() }),
			};
		} else if (expiresAt) {
			await deleteAddition(key);
		}

		await setAddition(key, String(now + seconds * 1000), seconds);

		return { success: true };
	};
}
