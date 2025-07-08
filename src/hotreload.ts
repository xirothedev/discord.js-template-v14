import chokidar from 'chokidar';
import { join, relative, resolve } from 'node:path';
import { client } from '.';
import { loadPrefixCommands, loadSlashCommands } from './handlers/command.handler';
import Logger from './utils/logger';
import { loadEvents } from './handlers/event.handler';
import { initI18n } from './handlers/i18n.handler';

const logger = new Logger();
const ROOT_DIR = process.cwd();
const SRC_DIR = resolve(join(ROOT_DIR, 'src'));

const relativePath = (filePath: string) => relative(ROOT_DIR, filePath);

const watcher = chokidar.watch(SRC_DIR, {
	ignored: [/node_modules/, /hotreload.ts/, /index.ts/],
	persistent: true,
	ignoreInitial: true,
	interval: 500,
	binaryInterval: 300,
});

function clearRequireCache(modulePath: string) {
	const resolvedPath = require.resolve(modulePath);
	if (require.cache[resolvedPath]) {
		delete require.cache[resolvedPath];
		logger.complete(`[HotReload] Cleared cache: ${relativePath(modulePath)}`);
	}
}

async function handleReload(filePath: string) {
	clearRequireCache(filePath);

	if (filePath.includes('/commands/slash/')) {
		await loadSlashCommands(client);
		logger.complete('[HotReload] Reloaded slash commands');
	} else if (filePath.includes('/commands/prefix/')) {
		await loadPrefixCommands(client);
		logger.complete('[HotReload] Reloaded prefix commands');
	} else if (filePath.includes('/events/')) {
		await loadEvents(client);
		logger.complete('[HotReload] Reloaded events');
	} else if (filePath.includes('/locales/') && filePath.endsWith('.json')) {
		await initI18n(client);
		logger.complete('[HotReload] Reloaded i18n');
	}
}

watcher
	.on('change', (filePath, stats) => {
		if (stats) logger.info(`File ${relativePath(filePath)} changed size to ${stats.size}`);
		else logger.watch(`[HotReload] File changed: ${relativePath(filePath)}`);
		void handleReload(filePath).then();
	})
	.on('add', (filePath) => {
		logger.watch(`[HotReload] File added: ${relativePath(filePath)}`);
		watcher.add(filePath);
		void handleReload(filePath).then();
	})
	.on('unlink', (filePath) => {
		logger.watch(`[HotReload] File removed: ${relativePath(filePath)}`);
		watcher.unwatch(filePath);
		void handleReload(filePath).then();
	})
	.on('addDir', (filePath) => logger.watch(`Directory ${relativePath(filePath)} has been added`))
	.on('unlinkDir', (filePath) => logger.watch(`Directory ${relativePath(filePath)} has been removed`))
	.on('error', (error: any) => logger.watch(`Watcher error: ${error}`))
	.on('ready', () => logger.success('Initial scan complete. Ready for changes'));

logger.info('[HotReload] Watching for file changes in src/');
