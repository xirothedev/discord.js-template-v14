import { config } from "@/config";
import type { BasePrefixCommand } from "@/structures/BasePrefixCommand";
import type { BaseSlashCommand } from "@/structures/BaseSlashCommand";
import { getEnvOrThrow } from "@/utils/getEnvOrThrow";
import Logger from "@/utils/logger";
import { Client, type ClientOptions, Collection } from "discord.js";
import { PrismaClient } from "prisma/generated";

export const logger = new Logger();
export const prisma = new PrismaClient();

export class CustomClient extends Client {
	slashCommands: Collection<string, BaseSlashCommand>;
	prefixCommands: Collection<string, BasePrefixCommand>;

	constructor(options: ClientOptions) {
		super(options);
		this.slashCommands = new Collection();
		this.prefixCommands = new Collection();
	}

	public config = config;
	public logger = logger;
	public prisma = prisma;
	public getEnv = getEnvOrThrow;
}
