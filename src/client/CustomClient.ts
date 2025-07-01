import { ActivityType, Client, type ClientOptions, Collection, PresenceUpdateStatus } from "discord.js";
import type { BaseSlashCommand } from "@/structures/BaseSlashCommand";
import type { BasePrefixCommand } from "@/structures/BasePrefixCommand";
import Logger from "@/utils/logger";
import { PrismaClient } from "prisma/generated";
import { getEnvOrThrow } from "@/utils/getEnvOrThrow";
import { config } from "@/config";

export const logger = new Logger();
export const prisma = new PrismaClient();

export class CustomClient extends Client {
	slashCommands: Collection<string, BaseSlashCommand>;
	prefixCommands: Collection<string, BasePrefixCommand>;

	constructor(options: ClientOptions) {
		super(options);
		this.slashCommands = new Collection();
		this.prefixCommands = new Collection();

		this.user?.setPresence({
			activities: [
				{
					name: "Template Building",
					state: "Build discord.js v14 template with Xiro The Dev",
					type: ActivityType.Streaming,
					url: "https://github.com/xirothedev/",
				},
				{
					name: "Web Developer",
					state: "Build webs with Xiro The Dev",
					type: ActivityType.Watching,
					url: "https://github.com/xirothedev/",
				},
				{
					name: "Play Game",
					state: "Play game with Xiro The Dev",
					type: ActivityType.Competing,
				},
				{
					name: "Listen Music",
					state: "Listen music with Xiro The Dev",
					type: ActivityType.Listening,
					url: "https://www.facebook.com/xirothedev/",
				},
			],
			status: PresenceUpdateStatus.DoNotDisturb,
		});
	}

	public config = config;
	public logger = logger;
	public prisma = prisma;
	public getEnv = getEnvOrThrow;
}
