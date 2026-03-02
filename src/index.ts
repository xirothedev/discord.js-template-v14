/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { GatewayIntentBits, Partials } from 'discord.js';
import { CustomClient } from './client/CustomClient';
import { loadPrefixCommands, loadSlashCommands } from './handlers/command.handler';
import { loadEvents } from './handlers/event.handler';
import { initI18n } from './handlers/i18n.handler';

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
	allowedMentions: { parse: ['roles', 'users'], repliedUser: false },
});

// Global error handlers for process stability
process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error);
});

// Graceful shutdown handlers
process.on('SIGINT', () => {
	console.log('\n🛑 Received SIGINT, shutting down gracefully...');
	void client.destroy().then(() => process.exit(0));
});

process.on('SIGTERM', () => {
	console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
	void client.destroy().then(() => process.exit(0));
});

void (async () => {
	console.clear();

	await initI18n(client);
	await loadPrefixCommands(client);
	await loadSlashCommands(client);
	await loadEvents(client);
	await client.login(client.getEnv('TOKEN'));
})();