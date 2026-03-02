/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { T } from '@/handlers/i18n.handler';
import { getUserId, type CommandContext, type GuardResult } from '@/structures/Guard';
import { getEnvOrThrow } from '@/utils/getEnvOrThrow';

export function OwnerOnlyGuard(ctx: CommandContext): GuardResult {
	const userId = getUserId(ctx);
	const locale = ctx?.guild?.locale || 'EnglishUS';
	
	if (!userId) {
		return { success: false, message: T(locale, 'cannot_identify_user') };
	}

	if (getEnvOrThrow<string>('OWNER') !== userId) {
		return { success: false, message: T(locale, 'owner_only', { ns: 'guards' }) };
	}

	return { success: true };
}