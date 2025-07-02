/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { GatewayIntentBits, Partials } from "discord.js";
import { CustomClient } from "./client/CustomClient";
import { loadPrefixCommands, loadSlashCommands } from "./handlers/command.handler";
import { loadEvents } from "./handlers/event.handler";
import { initI18n } from "./handlers/i18n.handler";

export const client = new CustomClient({
	// partial configuration required to enable direct messages
	partials: [
		Partials.Channel,
		Partials.GuildMember,
		Partials.Message,
		Partials.Reaction,
		Partials.User,
		Partials.ThreadMember,
	],
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.DirectMessageTyping,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildInvites,
		GatewayIntentBits.Guilds,
	],
	allowedMentions: { parse: ["roles", "users"], repliedUser: false },
});

(async () => {
	await initI18n(client);
	await loadPrefixCommands(client);
	await loadSlashCommands(client);
	await loadEvents(client);
	client.login(client.getEnv("TOKEN"));
})();
