interface RunOptions {
	cwd: string;
	command: string[];
	label: string;
}

async function runCommand(options: RunOptions): Promise<void> {
	const process = Bun.spawn(options.command, {
		cwd: options.cwd,
		stdout: 'inherit',
		stderr: 'inherit',
		stdin: 'inherit',
	});

	const exitCode = await process.exited;
	if (exitCode !== 0) {
		throw new Error(`${options.label} failed with exit code ${exitCode}`);
	}
}

export async function installDependencies(targetDir: string): Promise<void> {
	await runCommand({
		cwd: targetDir,
		command: ['bun', 'install'],
		label: 'Dependency installation',
	});
}

export async function generatePrismaClient(targetDir: string): Promise<void> {
	await runCommand({
		cwd: targetDir,
		command: ['bunx', 'prisma', 'generate'],
		label: 'Prisma client generation',
	});
}

export async function initializeGitRepo(targetDir: string): Promise<void> {
	const probe = Bun.spawn(['git', '--version'], {
		cwd: targetDir,
		stdout: 'ignore',
		stderr: 'ignore',
	});

	if ((await probe.exited) !== 0) {
		console.warn('⚠️ Git is not available. Skipping repository initialization.');
		return;
	}

	await runCommand({
		cwd: targetDir,
		command: ['git', 'init'],
		label: 'Git initialization',
	});
}
