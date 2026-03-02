#!/usr/bin/env bun

import { createProject } from './create';

if (import.meta.main) {
	void createProject(process.argv.slice(2)).catch((error: unknown) => {
		if (error instanceof Error) {
			console.error(`❌ ${error.message}`);
		} else {
			console.error('❌ Unexpected error while creating project.');
		}
		process.exit(1);
	});
}
