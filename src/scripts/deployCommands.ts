/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { GatewayIntentBits } from 'discord.js';
import { CustomClient } from '@/client/CustomClient';
import { deploySlashCommands, loadSlashCommands } from '@/handlers/command.handler';
import { initI18n } from '@/handlers/i18n.handler';

void (async () => {
	const client = new CustomClient({
		intents: [GatewayIntentBits.Guilds],
	});

	await initI18n(client);
	const loaded = await loadSlashCommands(client);
	await deploySlashCommands(client, loaded);
	await client.prisma.$disconnect();
	process.exit(0);
})();
