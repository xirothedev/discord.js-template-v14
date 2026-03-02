/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ActivityType, PresenceUpdateStatus, type Client } from 'discord.js';
import { BaseEvent } from '@/structures/BaseEvent';
import { getEnvBoolean } from '@/utils/env';

export class ReadyEvent extends BaseEvent<'clientReady'> {
	constructor(client: CustomClient) {
		super(client, 'clientReady', true);
	}

	execute(client: Client<true>) {
		this.client.logger.info(`✅ Bot is ready as ${client.user?.tag}`);
		if (getEnvBoolean('SCHEDULER_ENABLED', true)) {
			this.client.scheduler.start();
			this.client.logger.info('⏱ Scheduler started');
		}

		client.user.setPresence({
			activities: [
				{
					name: 'Template Building',
					state: 'Build discord.js v14 template with Xiro The Dev',
					type: ActivityType.Streaming,
					url: 'https://github.com/xirothedev/',
				},
				{
					name: 'Web Developer',
					state: 'Build webs with Xiro The Dev',
					type: ActivityType.Watching,
					url: 'https://github.com/xirothedev/',
				},
				{
					name: 'Play Game',
					state: 'Play game with Xiro The Dev',
					type: ActivityType.Competing,
				},
				{
					name: 'Listen Music',
					state: 'Listen music with Xiro The Dev',
					type: ActivityType.Listening,
					url: 'https://www.facebook.com/xirothedev/',
				},
			],
			status: PresenceUpdateStatus.DoNotDisturb,
		});
	}
}
