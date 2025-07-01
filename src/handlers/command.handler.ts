import type { BasePrefixCommand } from "@/structures/BasePrefixCommand";
import type { BaseSlashCommand } from "@/structures/BaseSlashCommand";
import { getPrivateGuildId } from "@/structures/Private";
import { readCommandFiles } from "@/utils/readCommandFiles";
import { REST, Routes } from "discord.js";
import { join } from "node:path";

export const loadSlashCommands = async (client: CustomClient) => {
	const files = readCommandFiles(join(__dirname, "../commands/slash"), ".slash.ts");

	const globalCommands: BaseSlashCommand[] = [];
	const guildCommandsMap = new Map<string, BaseSlashCommand[]>();

	for (const file of files) {
		const { [Object.keys(require(file))[0]]: Command } = await import(file);
		const command = new Command(client) as BaseSlashCommand;

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

	const rest = new REST({ version: "10" }).setToken(client.getEnv("TOKEN"));

	// Deploy global
	if (globalCommands.length > 0) {
		await rest.put(Routes.applicationCommands(client.getEnv("CLIENT_ID")), {
			body: globalCommands.map((c) => c.data.toJSON()),
		});
		client.logger.complete(`🌍 Deployed ${globalCommands.length} global slash commands`);
	}

	// Deploy private guild commands
	for (const [guildId, commands] of guildCommandsMap.entries()) {
		await rest.put(Routes.applicationGuildCommands(client.getEnv("CLIENT_ID"), guildId), {
			body: commands.map((c) => c.data.toJSON()),
		});
		client.logger.complete(`🏠 Deployed ${commands.length} commands to guild ${guildId}`);
	}

	client.logger.complete(`✅ Total loaded slash commands: ${client.slashCommands.size}`);
};

export const loadPrefixCommands = async (client: CustomClient) => {
	const files = readCommandFiles(join(__dirname, "../commands/prefix"), ".prefix.ts");

	for (const file of files) {
		const { [Object.keys(require(file))[0]]: Command } = await import(file);
		const command = new Command(client) as BasePrefixCommand;
		client.prefixCommands.set(command.name, command);
	}

	client.logger.complete(`📟 Loaded ${client.prefixCommands.size} prefix commands`);
};
