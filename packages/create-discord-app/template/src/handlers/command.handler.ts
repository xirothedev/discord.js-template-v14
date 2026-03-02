/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type { BasePrefixCommand } from '@/structures/BasePrefixCommand';
import type { BaseSlashCommand } from '@/structures/BaseSlashCommand';
import { getPrivateGuildId } from '@/structures/Private';
import { readCommandFiles } from '@/utils/readCommandFiles';
import { REST, Routes } from 'discord.js';
import { join } from 'node:path';

type LoadedSlashCommands = {
	globalCommands: BaseSlashCommand[];
	guildCommandsMap: Map<string, BaseSlashCommand[]>;
};

const getCommandExport = (module: Record<string, unknown>) => {
	const firstKey = Object.keys(module)[0];
	if (!firstKey) {
		throw new Error('Unable to resolve command export from module');
	}

	return module[firstKey] as new (client: CustomClient) => BaseSlashCommand;
};

const getPrefixCommandExport = (module: Record<string, unknown>) => {
	const firstKey = Object.keys(module)[0];
	if (!firstKey) {
		throw new Error('Unable to resolve prefix command export from module');
	}

	return module[firstKey] as new (client: CustomClient) => BasePrefixCommand;
};

export const loadSlashCommands = async (client: CustomClient): Promise<LoadedSlashCommands> => {
	const files = readCommandFiles(join(__dirname, '../commands/slash'), '.slash.ts');

	const globalCommands: BaseSlashCommand[] = [];
	const guildCommandsMap = new Map<string, BaseSlashCommand[]>();
	client.slashCommands.clear();

	for (const file of files) {
		const module = await import(file);
		const Command = getCommandExport(module);
		const command = new Command(client);

		const privateGuildId = getPrivateGuildId(Object.getPrototypeOf(command).constructor);
		if (privateGuildId) {
			if (!guildCommandsMap.has(privateGuildId)) {
				guildCommandsMap.set(privateGuildId, []);
			}
			guildCommandsMap.get(privateGuildId)?.push(command);
		} else {
			globalCommands.push(command);
		}

		client.slashCommands.set(command.data.name, command);
	}

	client.logger.complete(`🧭 Loaded ${client.slashCommands.size} slash commands into registry`);
	return { globalCommands, guildCommandsMap };
};

export const deploySlashCommands = async (client: CustomClient, loaded?: LoadedSlashCommands) => {
	const { globalCommands, guildCommandsMap } = loaded ?? (await loadSlashCommands(client));
	const rest = new REST({ version: '10' }).setToken(client.getEnv('TOKEN'));

	// Deploy global
	if (globalCommands.length > 0) {
		await rest.put(Routes.applicationCommands(client.getEnv('CLIENT_ID')), {
			body: globalCommands.map((c) => c.data.toJSON()),
		});
		client.logger.complete(`🌍 Deployed ${globalCommands.length} global slash commands`);
	}

	// Deploy private guild commands
	for (const [guildId, commands] of guildCommandsMap.entries()) {
		await rest.put(Routes.applicationGuildCommands(client.getEnv('CLIENT_ID'), guildId), {
			body: commands.map((c) => c.data.toJSON()),
		});
		client.logger.complete(`🏠 Deployed ${commands.length} commands to guild ${guildId}`);
	}

	client.logger.complete(`✅ Deployed ${client.slashCommands.size} slash commands`);
};

export const loadPrefixCommands = async (client: CustomClient) => {
	const files = readCommandFiles(join(__dirname, '../commands/prefix'), '.prefix.ts');
	client.prefixCommands.clear();

	for (const file of files) {
		const module = (await import(file)) as Record<string, unknown>;
		const Command = getPrefixCommandExport(module);
		const command = new Command(client);
		client.prefixCommands.set(command.name, command);
	}

	client.logger.complete(`📟 Loaded ${client.prefixCommands.size} prefix commands`);
};
