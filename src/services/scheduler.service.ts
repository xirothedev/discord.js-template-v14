/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { acquireLock, releaseLock } from '@/store/redisStore';
import type { ScheduledJob } from '@prisma/client';
import { TextChannel } from 'discord.js';
import { randomUUID } from 'node:crypto';

const LOOP_INTERVAL_MS = 10_000;
const LOCK_EXPIRE_SECONDS = 30;
const MAX_ATTEMPTS = 5;

type ReminderPayload = {
	channelId: string;
	authorId: string;
	content: string;
};

export class SchedulerService {
	private interval: NodeJS.Timeout | null = null;
	private readonly workerId = randomUUID();
	private running = false;

	constructor(private readonly client: CustomClient) {}

	start() {
		if (this.interval) return;

		this.interval = setInterval(() => {
			void this.tick();
		}, LOOP_INTERVAL_MS);
	}

	stop() {
		if (!this.interval) return;
		clearInterval(this.interval);
		this.interval = null;
	}

	private async tick() {
		if (this.running) return;
		this.running = true;
		try {
			const now = new Date();
			const jobs = await this.client.prisma.scheduledJob.findMany({
				where: {
					status: {
						in: ['pending', 'retry'],
					},
					runAt: {
						lte: now,
					},
				},
				orderBy: {
					runAt: 'asc',
				},
				take: 25,
			});

			for (const job of jobs) {
				await this.processOne(job);
			}
		} catch (error) {
			this.client.logger.error('Scheduler tick failed', error);
		} finally {
			this.running = false;
		}
	}

	private async processOne(job: ScheduledJob) {
		const lockKey = `lock:job:${job.id}`;
		const locked = await acquireLock(lockKey, this.workerId, LOCK_EXPIRE_SECONDS);
		if (!locked) return;

		try {
			await this.client.prisma.scheduledJob.update({
				where: { id: job.id },
				data: {
					status: 'running',
					attempts: {
						increment: 1,
					},
				},
			});

			switch (job.type) {
				case 'reminder':
					await this.executeReminder(job);
					break;
				default:
					throw new Error(`Unknown scheduled job type: ${job.type}`);
			}

			await this.client.prisma.scheduledJob.update({
				where: { id: job.id },
				data: {
					status: 'succeeded',
					lastError: null,
				},
			});
		} catch (error) {
			const latest = await this.client.prisma.scheduledJob.findUnique({ where: { id: job.id } });
			const attempts = latest?.attempts ?? job.attempts + 1;
			const shouldRetry = attempts < MAX_ATTEMPTS;
			const backoffMs = Math.min(60_000, Math.pow(2, attempts) * 1000);

			await this.client.prisma.scheduledJob.update({
				where: { id: job.id },
				data: {
					status: shouldRetry ? 'retry' : 'failed',
					runAt: shouldRetry ? new Date(Date.now() + backoffMs) : job.runAt,
					lastError: error instanceof Error ? error.message : 'unknown scheduler error',
				},
			});
		} finally {
			await releaseLock(lockKey);
		}
	}

	private async executeReminder(job: ScheduledJob) {
		const payload = job.payload as ReminderPayload;
		const channel = await this.client.channels.fetch(payload.channelId);
		if (!channel || !(channel instanceof TextChannel)) {
			throw new Error(`Reminder channel not found: ${payload.channelId}`);
		}

		await channel.send(`⏰ <@${payload.authorId}> ${payload.content}`);
	}
}
