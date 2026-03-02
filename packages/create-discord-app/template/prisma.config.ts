import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';
import { join } from 'path';

export default defineConfig({
	schema: join(__dirname, 'prisma', 'schema'),
	migrations: {
		path: 'prisma/migrations',
		seed: 'bun run prisma/seed.ts',
	},
	datasource: {
		url: env('DATABASE_URL'),
	},
});
