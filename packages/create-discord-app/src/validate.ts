import { mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';

export async function ensureEmptyTargetDirectory(targetDir: string): Promise<void> {
	if (!existsSync(targetDir)) {
		await mkdir(targetDir, { recursive: true });
		return;
	}

	const targetStat = await stat(targetDir);
	if (!targetStat.isDirectory()) {
		throw new Error(`Target exists and is not a directory: ${targetDir}`);
	}

	const files = await readdir(targetDir);
	if (files.length > 0) {
		throw new Error(`Target directory is not empty: ${targetDir}`);
	}
}
