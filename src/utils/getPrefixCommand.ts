/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { userMention } from 'discord.js';
import { client } from '..';
import type { Guild } from 'prisma/generated';

export function getPrefixCommand(content: string, guild?: Guild) {
	let prefix: string;

	const guildPrefix = guild?.prefix ?? client.getEnv<string>('PREFIX');
	if (content.toLowerCase().startsWith(guildPrefix.toLowerCase())) {
		prefix = guildPrefix;
	} else if (client.user && content.startsWith(userMention(client.user.id))) {
		prefix = userMention(client.user.id);
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
