/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { CommandContext, Guard } from "@/structures/Guard";
import { T } from "@/handlers/i18n.handler";

export function PermissionGuard(...permissions: string[]): Guard {
	return ({ message, interaction, guild }: CommandContext) => {
		const member = message?.member || interaction?.member;
		const locale = guild?.locale || "EnglishUS";
		if (!member || !("permissions" in member)) {
			return {
				success: false,
				message: T(locale, "permission.cannotVerify"),
			};
		}

		// biome-ignore lint/suspicious/noExplicitAny: multiple permissions
		const missing = permissions.filter((p) => !(member.permissions as any).has(p));
		if (missing.length > 0) {
			return {
				success: false,
				message: T(locale, "permission.missing", { permissions: missing.join(", ") }),
			};
		}

		return { success: true };
	};
}
