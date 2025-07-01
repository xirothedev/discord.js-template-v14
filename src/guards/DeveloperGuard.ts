import type { CommandContext, Guard } from "@/structures/Guard";
import { client } from "..";

export function DeveloperGuard(): Guard {
	return ({ message, interaction }: CommandContext) => {
		const userId = message?.author?.id || interaction?.user?.id;
		if (!userId) {
			return { success: false, message: "❌ Không thể xác định người dùng." };
		}

		if (!client.config.developers.includes(userId)) {
			return {
				success: false,
				message: "⚠️ Lệnh này chỉ dành cho developer.",
			};
		}

		return { success: true };
	};
}
