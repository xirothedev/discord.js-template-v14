import { cp, readFile, rename, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { toValidPackageName } from './naming';

export async function copyTemplate(templateDir: string, targetDir: string): Promise<void> {
	await cp(templateDir, targetDir, { recursive: true, force: false, errorOnExist: true });

	const gitignorePath = path.join(targetDir, '_gitignore');
	if (existsSync(gitignorePath)) {
		await rename(gitignorePath, path.join(targetDir, '.gitignore'));
	}
}

export async function updatePackageName(targetDir: string, projectName: string): Promise<void> {
	const packageJsonPath = path.join(targetDir, 'package.json');
	const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as { name?: string };
	packageJson.name = toValidPackageName(projectName);
	await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, '\t')}\n`, 'utf8');
}
