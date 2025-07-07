/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { T } from "@/handlers/i18n.handler";
import type { CommandContext, Guard } from "@/structures/Guard";
import type { PermissionsString } from "discord.js";

export function ClientPermissionGuard(permissions: PermissionsString[]): Guard {
	return ({ message, guild }: CommandContext) => {
		const client = message?.guild?.members.me;
		const locale = guild?.locale || "EnglishUS";
		if (!client || !("permissions" in client)) {
			return {
				success: false,
				message: T(locale, "permission.cannotVerify", { ns: "guards" }),
			};
		}

		const missingPerms = client.permissions.missing(permissions, false);

		if (missingPerms.length !== 0) {
			return {
				success: false,
				message: T(locale, "permission.clientMissing", { ns: "guards", permissions: missingPerms.join(", ") }),
			};
		}

		return { success: true };
	};
}
