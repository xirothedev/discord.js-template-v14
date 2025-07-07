/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { CommandContext, Guard } from '@/structures/Guard';
import { client } from '..';
import { T } from '@/handlers/i18n.handler';

export function DeveloperGuard(): Guard {
	return ({ message, interaction, guild }: CommandContext) => {
		const userId = message?.author?.id || interaction?.user?.id;
		if (!userId) {
			return {
				success: false,
				message: T(guild?.locale || 'EnglishUS', 'cannot_identify_user'),
			};
		}

		if (!client.config.developers.includes(userId)) {
			return {
				success: false,
				message: T(guild?.locale || 'EnglishUS', 'developer_only', {
					ns: 'guards',
				}),
			};
		}

		return { success: true };
	};
}
