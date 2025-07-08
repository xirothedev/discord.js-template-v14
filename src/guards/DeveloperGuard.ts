/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { T } from '@/handlers/i18n.handler';
import type { CommandContext, GuardResult } from '@/structures/Guard';
import { client } from '..';

export function DeveloperGuard(ctx: CommandContext): GuardResult {
	const userId = ctx?.message?.author?.id || ctx?.interaction?.user?.id;
	const locale = ctx?.guild?.locale || 'EnglishUS';
	if (!userId) {
		return {
			success: false,
			message: T(locale, 'cannot_identify_user'),
		};
	}

	if (!client.config.developers.includes(userId)) {
		return {
			success: false,
			message: T(locale, 'developer_only', {
				ns: 'guards',
			}),
		};
	}

	return { success: true };
}
