/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { getUserId, type CommandContext, type GuardResult } from '@/structures/Guard';
import { getEnvOrThrow } from '@/utils/getEnvOrThrow';

export function OwnerOnlyGuard(ctx: CommandContext): GuardResult {
	const userId = getUserId(ctx);
	if (!userId) {
		return { success: false, message: '❌ Không thể xác định người dùng.' };
	}

	if (getEnvOrThrow<string>('OWNER') !== userId) {
		return { success: false, message: '❌ Lệnh này chỉ dành cho Owner.' };
	}

	return { success: true };
}
