/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { GatewayIntentBits, Partials } from 'discord.js';
import { CustomClient } from './client/CustomClient';
import { deploySlashCommands, loadPrefixCommands, loadSlashCommands } from './handlers/command.handler';
import { loadEvents } from './handlers/event.handler';
import { initI18n } from './handlers/i18n.handler';
import { getEnvBoolean } from './utils/env';

const enablePrefixCommands = getEnvBoolean('ENABLE_PREFIX_COMMANDS', true);
const enableGuildPresences = getEnvBoolean('ENABLE_INTENT_GUILD_PRESENCES', false);
const enableGuildVoiceStates = getEnvBoolean('ENABLE_INTENT_GUILD_VOICE_STATES', false);
const enableGuildInvites = getEnvBoolean('ENABLE_INTENT_GUILD_INVITES', false);
const autoDeployCommands = getEnvBoolean('AUTO_DEPLOY_COMMANDS', false);

const intents: GatewayIntentBits[] = [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers];
if (enablePrefixCommands) {
	intents.push(GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent);
}
if (enableGuildPresences) intents.push(GatewayIntentBits.GuildPresences);
if (enableGuildVoiceStates) intents.push(GatewayIntentBits.GuildVoiceStates);
if (enableGuildInvites) intents.push(GatewayIntentBits.GuildInvites);

export const client = new CustomClient({
	// partial configuration required to enable direct messages
	partials: [Partials.Channel, Partials.GuildMember, Partials.Message, Partials.User],
	intents,
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
	client.scheduler.stop();
	void client.prisma.$disconnect().then(() => client.destroy().then(() => process.exit(0)));
});

process.on('SIGTERM', () => {
	console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
	client.scheduler.stop();
	void client.prisma.$disconnect().then(() => client.destroy().then(() => process.exit(0)));
});

void (async () => {
	console.clear();

	await initI18n(client);
	if (enablePrefixCommands) {
		await loadPrefixCommands(client);
	} else {
		client.logger.info('Prefix commands are disabled via ENABLE_PREFIX_COMMANDS=false');
	}

	const loadedSlashCommands = await loadSlashCommands(client);
	if (autoDeployCommands) {
		await deploySlashCommands(client, loadedSlashCommands);
	} else {
		client.logger.info('Auto command deployment is disabled. Use `bun run deploy:commands` to deploy.');
	}

	await loadEvents(client);
	await client.login(client.getEnv('TOKEN'));
})();
