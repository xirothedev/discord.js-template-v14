/*---------------------------------------------------------------------------------------------
 *  Copyright (c) xirothedev. All rights reserved.
 *  Licensed under the MIT License. See LICENSE.md in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

export const readCommandFiles = (dir: string, ext: string): string[] => {
	const files: string[] = [];

	for (const entry of readdirSync(dir)) {
		const fullPath = join(dir, entry);
		const stat = statSync(fullPath);

		if (stat.isDirectory()) {
			files.push(...readCommandFiles(fullPath, ext));
		} else if (stat.isFile() && fullPath.endsWith(ext)) {
			files.push(fullPath);
		}
	}

	return files;
};
