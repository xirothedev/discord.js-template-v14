/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { readdirSync } from 'node:fs';
import path from 'node:path';
import type { BaseEvent } from '@/structures/BaseEvent';
import type { ClientEvents } from 'discord.js';

export const loadEvents = async (client: CustomClient) => {
	const files = readdirSync(path.join(__dirname, '../events')).filter(
		(file) => file.endsWith('.ts') || file.endsWith('.js'),
	);

	for (const file of files) {
		const module = (await import(`../events/${file}`)) as Record<string, unknown>;
		const firstKey = Object.keys(module)[0];
		if (!firstKey) {
			throw new Error(`Unable to resolve event export for file: ${file}`);
		}

		const Event = module[firstKey] as new (client: CustomClient) => BaseEvent<keyof ClientEvents>;
		const event = new Event(client);

		if (event.once) {
			client.once(event.name, (...args) => void event.execute(...args));
		} else {
			client.on(event.name, (...args) => void event.execute(...args));
		}
	}

	client.logger.complete(`📡 Loaded ${files.length} events`);
};
