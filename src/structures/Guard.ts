/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { Message, ChatInputCommandInteraction } from "discord.js";
import type { Guild, User } from "prisma/generated";

export type CommandContext = {
	interaction?: ChatInputCommandInteraction;
	message?: Message;
	args?: string[];
	guild?: Guild;
	user?: User;
};

export type GuardResult = {
	success: boolean;
	message?: string;
};

export type Guard = (context: CommandContext) => Promise<GuardResult> | GuardResult;

export function getUserId(ctx: CommandContext): string | undefined {
	return ctx.message?.author?.id || ctx.interaction?.user?.id;
}
