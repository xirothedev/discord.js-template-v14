/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { existsAddition, getAddition, setAddition } from '@/store/redisStore';
import type { Guild, User } from '@prisma/client';

const GUILD_CACHE_TTL_SECONDS = 30 * 60;
const USER_CACHE_TTL_SECONDS = 60 * 60;

type CachedGuild = Pick<Guild, 'id' | 'prefix' | 'locale'>;

export class EntityAccessService {
	constructor(private readonly client: CustomClient) {}

	private guildCacheKey(guildId: string) {
		return `cache:guild:${guildId}`;
	}

	private userCacheKey(userId: string) {
		return `cache:user:${userId}`;
	}

	async getOrCreateGuild(guildId: string): Promise<Guild> {
		const cached = await getAddition<CachedGuild>(this.guildCacheKey(guildId));
		if (cached && cached.id && cached.prefix && cached.locale) {
			return cached as Guild;
		}

		const guild = await this.client.prisma.guild.upsert({
			where: { id: guildId },
			create: { id: guildId },
			update: {},
		});

		await setAddition(this.guildCacheKey(guildId), guild, GUILD_CACHE_TTL_SECONDS);
		return guild;
	}

	async getOrCreateUser(userId: string): Promise<User> {
		const key = this.userCacheKey(userId);
		const exists = await existsAddition(key);
		if (exists) {
			return { id: userId } as User;
		}

		const user = await this.client.prisma.user.upsert({
			where: { id: userId },
			create: { id: userId },
			update: {},
		});

		await setAddition(key, '1', USER_CACHE_TTL_SECONDS);
		return user;
	}

	async updateGuildCache(guild: Guild): Promise<void> {
		await setAddition(this.guildCacheKey(guild.id), guild, GUILD_CACHE_TTL_SECONDS);
	}
}
