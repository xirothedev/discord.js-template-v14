/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { userMention } from 'discord.js';
import type { Guild } from '@prisma/client';

type PrefixContext = {
	defaultPrefix: string;
	mentionUserId?: string;
};

export function getPrefixCommand(content: string, guild: Guild | undefined, context: PrefixContext) {
	let prefix: string;

	const guildPrefix = guild?.prefix ?? context.defaultPrefix;
	const mentionPrefixes = context.mentionUserId
		? [userMention(context.mentionUserId), `<@!${context.mentionUserId}>`]
		: [];

	if (content.toLowerCase().startsWith(guildPrefix.toLowerCase())) {
		prefix = guildPrefix;
	} else if (mentionPrefixes.some((candidate) => content.startsWith(candidate))) {
		prefix = mentionPrefixes.find((candidate) => content.startsWith(candidate))!;
	} else {
		return null;
	}

	const args = content.slice(prefix.length).trim().split(/ +/g);
	const commandInput = args.shift()?.toLowerCase();

	if (!commandInput) {
		return null;
	}

	return { prefix, commandInput, args };
}
