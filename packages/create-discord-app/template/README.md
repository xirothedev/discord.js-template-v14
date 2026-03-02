# discord.js-template-v14

[![Build Status](https://github.com/xirothedev/discord.js-template-v14/actions/workflows/build.yml/badge.svg)](https://github.com/xirothedev/discord.js-template-v14/actions/workflows/build.yml)
[![License](https://img.shields.io/github/license/xirothedev/discord.js-template-v14)](./LICENSE)
[![Bun.js](https://img.shields.io/badge/Bun.js-%3E=1.0.0-black?logo=bun&logoColor=white)](https://bun.sh/)
[![Discord.js v14](https://img.shields.io/badge/discord.js-v14-blue)](https://discord.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)](https://www.typescriptlang.org/)
[![Redis Support](https://img.shields.io/badge/Redis-Supported-red)](https://redis.io/)

A modern, scalable, and extensible Discord bot template built with [discord.js v14](https://discord.js.org/), redis, TypeScript, and Prisma ORM. This template is designed for rapid development of robust Discord bots, featuring multi-language support, modular command/event handling, and PostgreSQL integration.

## Quick Create (Bun CLI)

Generate a new bot project without cloning this repository:

```sh
bunx @xirothedev/create-discord-app my-bot
```

The generator will:

- scaffold the template into `my-bot`
- prompt for core `.env` values (with optional `TOKEN`/`CLIENT_ID`)
- auto-generate `DATABASE_URL` from your project name
- run `bun install` and `bunx prisma generate` (unless `--skip-install`)
- initialize git (unless `--no-git`)

Show available options:

```sh
bunx @xirothedev/create-discord-app --help
```

## Features

- **TypeScript-first**: Strict typing and modern JavaScript features.
- **discord.js v14**: Latest Discord API features and best practices.
- **Prisma ORM**: Type-safe database access with PostgreSQL.
- **Redis support**: Fast caching, cooldowns, and distributed state management via Bun's built-in Redis client (7.9x faster than ioredis).
- **Multi-language (i18n)**: Built-in localization with [i18next](https://www.i18next.com/).
- **Modular architecture**: Easy to add commands, events, and features.
- **Extensible client**: CustomClient class for shared utilities and services.
- **Comprehensive logging**: Uses [signale](https://github.com/klaussinani/signale) for structured logs.
- **Linting & formatting**: Enforced by [Prettier](https://prettier.io/docs/install/).
- **Hot Reloading**: Automatically restarts your bot during development when file changes are detected using Bun's native `--watch` mode. Simply run `bun dev` to start the bot in development mode with hot-reload enabled.

## Tech Stack

- **Languages**: TypeScript
- **Frameworks/Libraries**: discord.js, Prisma, i18next, signale, dayjs
- **Database**: PostgreSQL (via Prisma)
- **Package Manager**: bun (preferred)
- **Runtime**: Bun.js
- **Linting/Formatting**: Prettier

## Project Structure

```
.
├── prisma/
│   ├── schema/           # Prisma schema
│   └── generated/        # Prisma client (auto-generated)
├── packages/
│   └── create-discord-app/ # Bun-first scaffolding CLI package
├── src/
│   ├── client/           # Custom Discord client
│   ├── commands/         # Prefix and slash commands
│   ├── config/           # Configuration files
│   ├── decorators/       # Decorators for commands/events
│   ├── events/           # Event handlers
│   ├── functions/        # Utility functions
│   ├── guards/           # Command guards/middleware
│   ├── handlers/         # Command/event/i18n loaders
│   ├── locales/          # i18n translation files
│   ├── store/            # Store config (redis, etc.)
│   ├── structures/       # Base classes for commands/events
│   ├── typings/          # Custom TypeScript types
│   ├── utils/            # Utility modules (logger, etc.)
│   └── index.ts          # Entry point
├── package.json          # Project info & scripts
├── tsconfig.json         # TypeScript config
├── .prettierrc.json      # Prettier configuration
├── .prettierignore       # Files/folders ignored by Prettier
├── eslint.config.mjs     # ESLint configuration
└── bun.lock              # Bun lockfile (if using Bun)
```

## Database Models (Prisma)

**prisma/schema/schema.prisma:**

```prisma
model User {
  id String @id
}

model Guild {
  id     String @id
  prefix String @default("s?")
  locale Language @default(EnglishUS)
}

enum Language {
  EnglishUS
  Vietnamese
}
```

## Redis Store

This template supports Redis for fast, ephemeral storage—ideal for features like cooldowns, caching, and distributed state. Redis is integrated via Bun's built-in Redis client, and utility functions are provided in `src/store/redisStore.ts`.

#### Setup

1. **Start a Redis server** (locally or via Docker):

    ```sh
    docker run -d --name redis -p 6379:6379 redis:alpine
    ```

2. **Configure environment variables** in your `.env` file:

    ```env
    # Using REDIS_URL (recommended)
    REDIS_URL=redis://:password@localhost:6379/0

    # Or use individual variables (for backward compatibility)
    REDIS_HOST=localhost
    REDIS_PORT=6379
    REDIS_PASSWORD=yourpassword
    ```

3. **No additional installation needed** - Bun's Redis client is built-in.

#### Usage Example

You can use the provided utility functions to interact with Redis:

```ts
import { setAddition, getAddition, deleteAddition } from '@/store/redisStore';

// Store a value with a key and expiration (in seconds)
await setAddition('mykey', { foo: 'bar' }, 600);

// Retrieve a value by key
const value = await getAddition('mykey');

// Delete a key
await deleteAddition('mykey');
```

**Other available functions:**

- `existsAddition(key)` – Check if a key exists.
- `expireAddition(key, seconds)` – Set a new expiration for a key.
- `getTTLAddition(key)` – Get the remaining TTL (in seconds) for a key.
- `keysAddition(pattern)` – List keys matching a pattern (e.g., `"cooldown:*"`).

#### Example: Cooldown Guard

Redis is used in the CooldownGuard to persist user command cooldowns:

```ts
const key = `cooldown:${userId}:${commandName}`;
const now = Date.now();
const expiresAt = (await getAddition(key)) || 0;

if (now < expiresAt) {
	// Still on cooldown
} else {
	await setAddition(key, String(now + seconds * 1000), seconds);
}
```

#### When to Use Redis

- **Cooldowns**: Prevent command spam across distributed bot instances.
- **Caching**: Store frequently accessed data for fast retrieval.
- **Ephemeral State**: Share state between processes or servers.

## Getting Started

### Prerequisites

- PostgreSQL database
- [Bun](https://bun.sh/) (for running scripts, optional but recommended)

### Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/xirothedev/discord.js-template-v14
    cd discord.js-template-v14
    ```

2. **Install dependencies:**

    ```sh
    bun install
    ```

3. **Configure environment variables:**
    - Copy `.env.example` to `.env` and fill in required values (e.g., `TOKEN`, `CLIENT_ID`, `DATABASE_URL`).
    - Optional runtime toggles:
        - `AUTO_DEPLOY_COMMANDS=false` (recommended)
        - `ENABLE_PREFIX_COMMANDS=true`
        - `SCHEDULER_ENABLED=true`

4. **Set up the database:**

    ```sh
    bun x prisma migrate dev
    ```

5. **Generate Prisma client:**
    ```sh
    bun x prisma generate
    ```

### Running the Bot

- **Development mode (with hot-reload):**

    ```sh
    bun dev
    ```

- **Production mode:**

    ```sh
    bun start
    ```

- **Deploy slash commands manually:**
    ```sh
    bun run deploy:commands
    ```

### Debugging

- VSCode launch configuration is provided in `.vscode/launch.json` for debugging with breakpoints.

## Usage & Extensibility

### Adding Commands

- **Prefix Commands:** Place new command files in `@/commands/prefix/` and extend `BasePrefixCommand`.
- **Slash Commands:** Place new command files in `@/commands/slash/` and extend `BaseSlashCommand`.

Each command class receives the `CustomClient` instance for shared services (logger, database, config, etc.).

### Adding Events

- Place new event handler files in `@/events/` and ensure they extend the appropriate base event class.

### Localization

- Add or edit translation files in `src/locales/` (e.g., `EnglishUS/common.json`, `Vietnamese/common.json`).
- The i18n system is initialized automatically and supports dynamic language switching.

### Database

- Define new models in `prisma/schema/schema.prisma`.
- Run `bun x prisma migrate dev` after schema changes.

### Usage example

#### Prefix Command

Create a new file in `src/commands/prefix/`, example: `ping.prefix.ts`:

```ts
import { BasePrefixCommand } from '@/structures/BasePrefixCommand';
import type { Message } from 'discord.js';
import type { Guild, User } from '@prisma/client';

export class PingCommand extends BasePrefixCommand {
	name = 'ping';
	description = 'Check bot latency';

	async execute(message: Message<true>, guild: Guild, user: User, args: string[]) {
		await message.reply(`Pong from ${guild.id} (user=${user.id}, args=${args.length})`);
	}
}
```

#### Slash Command

Create a new file in `src/commands/slash/`, example: `hello.slash.ts`:

```ts
import { BaseSlashCommand } from '@/structures/BaseSlashCommand';
import { SlashCommandBuilder, type ChatInputCommandInteraction } from 'discord.js';
import type { Guild, User } from '@prisma/client';

export class HelloCommand extends BaseSlashCommand {
	data = new SlashCommandBuilder().setName('hello').setDescription('Hello user!');

	async execute(interaction: ChatInputCommandInteraction, guild: Guild | undefined, user: User) {
		await interaction.reply(`Hello ${user.id} from guild ${guild?.id ?? 'DM'}`);
	}
}
```

#### Event

Create a new file in `@/events/`, example: `ready.ts`:

```ts
import { BaseEvent } from '@/structures';
import type { CustomClient } from '@/client/CustomClient';
import type { Client } from 'discord.js';

export class ReadyEvent extends BaseEvent<'clientReady'> {
	constructor(client: CustomClient) {
		super(client, 'clientReady', true);
	}

	execute(client: Client<true>) {
		this.client.logger.info(`Bot is ready as ${client.user.tag}`);
	}
}
```

#### Guards

Guards are functions or classes used to check conditions before executing a command (e.g., permissions, cooldowns, bot state, etc.). They help you control access logic and protect commands from abuse or misuse.

**Example: Cooldown Guard**

A cooldown guard prevents users from spamming commands by enforcing a waiting period between uses.

`@/guards/CooldownGuard.ts`:

```ts
import { T } from '@/handlers/i18n.handler';
import type { CommandContext } from '@/structures/Guard';
import { getPrefixCommand } from '@/utils/getPrefixCommand';
import { getAddition, setAddition } from '@/store/redisStore';

export function CooldownGuard(seconds: number) {
	return async ({ interaction, message, guild }: CommandContext) => {
		const userId = interaction?.user.id || message?.author.id;
		let commandName: string;

		if (interaction?.commandName) {
			commandName = interaction.commandName;
		} else if (message?.content) {
			const result = getPrefixCommand(message.content, guild, {
				defaultPrefix: process.env.PREFIX ?? 's?',
				mentionUserId: message.client.user?.id,
			});
			if (!result) {
				return {
					success: false,
					message: T(guild?.locale || 'EnglishUS', 'error'),
				};
			}
			commandName = result?.commandInput;
		} else {
			return {
				success: false,
				message: T(guild?.locale || 'EnglishUS', 'error'),
			};
		}

		const key = `${userId}:${commandName}`;
		const now = Date.now();
		const expiresAt = (await getAddition<number>(key)) || 0;

		if (now < expiresAt) {
			const remaining = Math.ceil((expiresAt - now) / 1000);
			return {
				success: false,
				message: T(guild?.locale || 'EnglishUS', 'guard.cooldown', {
					ns: 'guards',
					seconds: remaining.toString(),
				}),
			};
		}

		await setAddition(key, String(now + seconds * 1000), seconds);
		return { success: true };
	};
}
```

**How to use a guard in a command:**

```ts
import { BasePrefixCommand } from '@/structures/BasePrefixCommand';
import { CooldownGuard } from '@/guards/CooldownGuard';
import { UseGuards } from '@/decorators/useGuards.decorator';
import type { Message } from 'discord.js';
import type { Guild, User } from '@prisma/client';

@UseGuards(CooldownGuard(10))
export class PingCommand extends BasePrefixCommand {
	name = 'ping';
	description = 'Check bot latency';
	aliases = ['Pong'];

	async execute(message: Message<true>, guild: Guild, user: User, args: string[]) {
		await message.reply(`Pong ${user.id} (${guild.id}) ${args.join(',')}`);
	}
}
```

You can combine multiple guards for a command. If any guard returns a failure, the command will not be executed.

## Development Standards

- **Code Quality:** Enforced by Prettier (see `.prettierrc.json`).
- **Type Safety:** Strict TypeScript configuration (`tsconfig.json`).
- **Logging:** Use the provided logger (`src/utils/logger.ts`).
- **Error Handling:** All async operations should be wrapped with try/catch and logged.
- **Naming:** Use clear, descriptive names for files, classes, and functions.
- **Extensibility:** Favor composition and modularity for future features.

## Scripts

- `bun dev` — Start the bot in development mode (hot-reload).
- `bun start` — Start the bot in production mode.
- `bun run deploy:commands` — Deploy slash commands manually.
- `bun run check` — Run typecheck, lint, and tests.
- `bun x prisma migrate dev` — Run database migrations.
- `bun x prisma generate` — Generate Prisma client.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Create a new Pull Request

## Resource

- [CODE OF CONDUCT](/.github/CODE_OF_CONDUCT.md)
- [COMMIT CONVENTION](/.github/COMMIT_CONVENTION.md)
- [CONTRIBUTING](/.github/CONTRIBUTING.md)
- [FUNDING](/.github/FUNDING.yml)
- [PULL REQUEST TEMPLATE](/.github/PULL_REQUEST_TEMPLATE.md)
- [LICENSE](/LICENSE)
- [Discord server](https://discord.gg/GsYF4xceZZ)
- [Facebook](https://www.facebook.com/xirothedev/)
- [Email](lethanhtrung.trungle@gmail.com)
