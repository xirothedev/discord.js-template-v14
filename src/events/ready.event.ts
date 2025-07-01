import type { Client } from "discord.js";
import { BaseEvent } from "@/structures/BaseEvent";

export class ReadyEvent extends BaseEvent<"ready"> {
	constructor(client: CustomClient) {
		super(client, "ready", true);
	}

	async execute(client: Client) {
		this.client.logger.info(`✅ Bot is ready as ${client.user?.tag}`);
	}
}
