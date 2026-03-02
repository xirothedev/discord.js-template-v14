import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import type { PromptValues } from './types';

interface PromptContext {
	defaults: PromptValues;
	overrides: Partial<PromptValues>;
	yes: boolean;
}

export async function collectPromptValues(context: PromptContext): Promise<PromptValues> {
	const mergedDefaults: PromptValues = mergePromptValues(context.defaults, context.overrides);

	if (context.yes) {
		return normalizeValues(mergedDefaults);
	}

	const readline = createInterface({ input, output });
	try {
		const token = await prompt(readline, 'Bot TOKEN (optional)', mergedDefaults.token, true);
		const clientId = await prompt(readline, 'Discord CLIENT_ID (optional)', mergedDefaults.clientId, true);
		const owner = await prompt(readline, 'Bot OWNER user ID', mergedDefaults.owner, false);
		const developersDefault = mergedDefaults.developers || owner;
		const developers = await prompt(readline, 'Developer IDs (comma-separated)', developersDefault, false);
		const prefix = await prompt(readline, 'Prefix command trigger', mergedDefaults.prefix, false);
		const databaseUrl = await prompt(readline, 'DATABASE_URL', mergedDefaults.databaseUrl, false);
		const redisUrl = await prompt(readline, 'REDIS_URL', mergedDefaults.redisUrl, false);

		return normalizeValues({
			token,
			clientId,
			owner,
			developers,
			prefix,
			databaseUrl,
			redisUrl,
		});
	} finally {
		readline.close();
	}
}

function mergePromptValues(defaults: PromptValues, overrides: Partial<PromptValues>): PromptValues {
	const merged: PromptValues = { ...defaults };
	for (const [key, value] of Object.entries(overrides) as Array<[keyof PromptValues, string | undefined]>) {
		if (value !== undefined) {
			merged[key] = value;
		}
	}
	return merged;
}

async function prompt(
	readline: ReturnType<typeof createInterface>,
	label: string,
	defaultValue: string,
	allowEmpty: boolean,
): Promise<string> {
	const suffix = defaultValue ? ` [${defaultValue}]` : '';
	const answer = (await readline.question(`${label}${suffix}: `)).trim();
	const resolved = answer || defaultValue;

	if (allowEmpty || resolved.trim()) {
		return resolved;
	}

	console.error(`${label} is required.`);
	return prompt(readline, label, defaultValue, allowEmpty);
}

function normalizeValues(values: PromptValues): PromptValues {
	const owner = values.owner.trim();
	const developers = values.developers.trim() || owner;
	if (!owner) {
		throw new Error('OWNER is required. Pass --owner or provide it in interactive prompts.');
	}

	return {
		token: values.token.trim(),
		clientId: values.clientId.trim(),
		owner,
		developers,
		prefix: values.prefix.trim(),
		databaseUrl: values.databaseUrl.trim(),
		redisUrl: values.redisUrl.trim(),
	};
}
