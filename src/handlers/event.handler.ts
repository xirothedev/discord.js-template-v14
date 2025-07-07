/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { readdirSync } from 'node:fs';
import path from 'node:path';
import type { BaseEvent } from '@/structures/BaseEvent';

export const loadEvents = async (client: CustomClient) => {
	const files = readdirSync(path.join(__dirname, '../events')).filter(
		(file) => file.endsWith('.ts') || file.endsWith('.js'),
	);

	for (const file of files) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
		const { [Object.keys(await import(`../events/${file}`))[0]]: Event } = await import(`../events/${file}`);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		const event = new Event(client) as BaseEvent<'ready'>;

		if (event.once) {
			client.once(event.name, (...args) => void event.execute(...args));
		} else {
			client.on(event.name, (...args) => void event.execute(...args));
		}
	}

	client.logger.complete(`📡 Loaded ${files.length} events`);
};
