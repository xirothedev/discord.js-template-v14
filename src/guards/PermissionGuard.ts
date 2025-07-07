/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { T } from '@/handlers/i18n.handler';
import type { CommandContext, Guard } from '@/structures/Guard';
import type { PermissionsString } from 'discord.js';

export function PermissionGuard(permissions: PermissionsString[]): Guard {
	return ({ message, guild }: CommandContext) => {
		const member = message?.member;
		const locale = guild?.locale || 'EnglishUS';
		if (!member || !('permissions' in member)) {
			return {
				success: false,
				message: T(locale, 'permission.cannotVerify', { ns: 'guards' }),
			};
		}

		const missingPerms = member.permissions.missing(permissions, false);

		if (missingPerms.length !== 0) {
			return {
				success: false,
				message: T(locale, 'permission.missing', {
					ns: 'guards',
					permissions: missingPerms.join(', '),
				}),
			};
		}

		return { success: true };
	};
}
