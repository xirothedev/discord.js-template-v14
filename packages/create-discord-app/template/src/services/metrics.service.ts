/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

type MetricBucket = {
	total: number;
	success: number;
	failure: number;
	totalLatencyMs: number;
	maxLatencyMs: number;
};

type CommandSource = 'prefix' | 'slash';

export class MetricsService {
	private readonly startedAt = Date.now();
	private readonly buckets = new Map<string, MetricBucket>();

	record(commandName: string, source: CommandSource, latencyMs: number, success: boolean) {
		const key = `${source}:${commandName}`;
		const current = this.buckets.get(key) ?? {
			total: 0,
			success: 0,
			failure: 0,
			totalLatencyMs: 0,
			maxLatencyMs: 0,
		};

		current.total += 1;
		current.totalLatencyMs += latencyMs;
		current.maxLatencyMs = Math.max(current.maxLatencyMs, latencyMs);
		if (success) current.success += 1;
		else current.failure += 1;

		this.buckets.set(key, current);
	}

	getSnapshot() {
		const commands = [...this.buckets.entries()]
			.map(([key, value]) => {
				const [source, name] = key.split(':');
				const avgLatency = value.total === 0 ? 0 : Math.round(value.totalLatencyMs / value.total);
				return {
					source,
					name,
					total: value.total,
					success: value.success,
					failure: value.failure,
					avgLatencyMs: avgLatency,
					maxLatencyMs: value.maxLatencyMs,
				};
			})
			.sort((a, b) => b.total - a.total);

		return {
			startedAt: this.startedAt,
			uptimeMs: Date.now() - this.startedAt,
			commands,
		};
	}
}
