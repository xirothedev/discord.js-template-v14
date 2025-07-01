import type { CommandContext, GuardResult } from "@/structures/Guard";
import { getEnvOrThrow } from "@/utils/getEnvOrThrow";

export async function OwnerOnlyGuard(ctx: CommandContext): Promise<GuardResult> {
	const userId = ctx.message?.author?.id || ctx.interaction?.user?.id;
	if (!userId) {
		return { success: false, message: "❌ Không thể xác định người dùng." };
	}

	if (getEnvOrThrow<string>("OWNER") !== userId) {
		return { success: false, message: "❌ Lệnh này chỉ dành cho Owner." };
	}
  
	return { success: true };
}