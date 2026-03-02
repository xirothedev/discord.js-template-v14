/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { DEFAULT_MODULE_STATE, type BotModule } from '@/types/module';
import { getAddition, setAddition } from '@/store/redisStore';

const MODULE_CACHE_TTL_SECONDS = 15 * 60;

export class ModuleSettingsService {
	constructor(private readonly client: CustomClient) {}

	private cacheKey(guildId: string, module: BotModule) {
		return `module:${guildId}:${module}`;
	}

	async isEnabled(guildId: string, module: BotModule): Promise<boolean> {
		if (module === 'core') return true;

		const cached = await getAddition<boolean>(this.cacheKey(guildId, module));
		if (typeof cached === 'boolean') return cached;

		const setting = await this.client.prisma.guildModuleSetting.findUnique({
			where: {
				guildId_module: {
					guildId,
					module,
				},
			},
		});

		const enabled = setting?.enabled ?? DEFAULT_MODULE_STATE[module];
		await setAddition(this.cacheKey(guildId, module), enabled, MODULE_CACHE_TTL_SECONDS);
		return enabled;
	}

	async setEnabled(guildId: string, module: BotModule, enabled: boolean): Promise<void> {
		await this.client.prisma.guildModuleSetting.upsert({
			where: {
				guildId_module: {
					guildId,
					module,
				},
			},
			create: {
				guildId,
				module,
				enabled,
			},
			update: {
				enabled,
			},
		});

		await setAddition(this.cacheKey(guildId, module), enabled, MODULE_CACHE_TTL_SECONDS);
	}
}
