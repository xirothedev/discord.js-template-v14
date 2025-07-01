import type { CommandContext, Guard } from "@/structures/Guard";

export function PermissionGuard(...permissions: string[]): Guard {
	return ({ message, interaction }: CommandContext) => {
		const member = message?.member || interaction?.member;
		if (!member || !("permissions" in member)) {
			return {
				success: false,
				message: "❌ Không thể xác minh quyền của bạn.",
			};
		}

		// biome-ignore lint/suspicious/noExplicitAny: multiple permissions
		const missing = permissions.filter((p) => !(member.permissions as any).has(p));
		if (missing.length > 0) {
			return {
				success: false,
				message: `❌ Bạn cần quyền: \`${missing.join(", ")}\` để dùng lệnh này.`,
			};
		}

		return { success: true };
	};
}
