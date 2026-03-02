/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const BOT_MODULES = ['core', 'moderation', 'onboarding', 'automation', 'observability'] as const;

export type BotModule = (typeof BOT_MODULES)[number];

export const DEFAULT_MODULE_STATE: Record<BotModule, boolean> = {
	core: true,
	moderation: true,
	onboarding: false,
	automation: false,
	observability: true,
};
