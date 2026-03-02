/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { config } from '@/config';
import { EntityAccessService } from '@/services/entityAccess.service';
import { MetricsService } from '@/services/metrics.service';
import { ModuleSettingsService } from '@/services/moduleSettings.service';
import { SchedulerService } from '@/services/scheduler.service';
import type { BasePrefixCommand } from '@/structures/BasePrefixCommand';
import type { BaseSlashCommand } from '@/structures/BaseSlashCommand';
import { getEnvOrThrow } from '@/utils/getEnvOrThrow';
import Logger from '@/utils/logger';
import { Client, type ClientOptions, Collection } from 'discord.js';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

export const logger = new Logger();
export const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString: getEnvOrThrow('DATABASE_URL') }),
});

export class CustomClient extends Client {
	slashCommands: Collection<string, BaseSlashCommand>;
	prefixCommands: Collection<string, BasePrefixCommand>;
	metrics: MetricsService;
	entityAccess: EntityAccessService;
	moduleSettings: ModuleSettingsService;
	scheduler: SchedulerService;

	constructor(options: ClientOptions) {
		super(options);
		this.slashCommands = new Collection();
		this.prefixCommands = new Collection();
		this.metrics = new MetricsService();
		this.entityAccess = new EntityAccessService(this);
		this.moduleSettings = new ModuleSettingsService(this);
		this.scheduler = new SchedulerService(this);
	}

	public config = config;
	public logger = logger;
	public prisma = prisma;
	public getEnv = getEnvOrThrow;
}
