import type { CommandContext, Guard } from "@/structures/Guard";
import { client } from "..";
import { T } from "@/handlers/i18n.handler";

export function DeveloperGuard(): Guard {
	return ({ message, interaction, guild }: CommandContext) => {
		const userId = message?.author?.id || interaction?.user?.id;
		if (!userId) {
			return { success: false, message: "❌ Không thể xác định người dùng." };
		}

		if (!client.config.developers.includes(userId)) {
			return {
				success: false,
				message: T(guild?.locale || "EnglishUS", "developer_only", { ns: "guards" }),
			};
		}

		return { success: true };
	};
}
