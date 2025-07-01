import type { ClientEvents } from "discord.js";

export abstract class BaseEvent<T extends keyof ClientEvents> {
	constructor(
		protected client: CustomClient,
		public name: T,
		public once = false,
	) {
		this.name = name;
		this.once = once;
		this.client = client;
	}

	abstract execute(...args: ClientEvents[T]): Promise<void> | void;
}
