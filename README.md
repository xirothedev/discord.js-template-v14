# discord.js-template-v14

A modern, scalable, and extensible Discord bot template built with [discord.js v14](https://discord.js.org/), TypeScript, and Prisma ORM. This template is designed for rapid development of robust Discord bots, featuring multi-language support, modular command/event handling, and PostgreSQL integration.

## Features

- **TypeScript-first**: Strict typing and modern JavaScript features.
- **discord.js v14**: Latest Discord API features and best practices.
- **Prisma ORM**: Type-safe database access with PostgreSQL.
- **Multi-language (i18n)**: Built-in localization with [i18next](https://www.i18next.com/).
- **Modular architecture**: Easy to add commands, events, and features.
- **Extensible client**: CustomClient class for shared utilities and services.
- **Comprehensive logging**: Uses [signale](https://github.com/klaussinani/signale) for structured logs.
- **Linting & formatting**: Enforced by [Biome](https://biomejs.dev/).

## Tech Stack

- **Languages**: TypeScript
- **Frameworks/Libraries**: discord.js, Prisma, i18next, signale, dayjs
- **Database**: PostgreSQL (via Prisma)
- **Package Manager**: pnpm (preferred)
- **Runtime**: Bun.js
- **Linting/Formatting**: Biome

## Project Structure

```
.
├── prisma/
│   ├── schema/           # Prisma schema
│   └── generated/        # Prisma client (auto-generated)
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
│   ├── structures/       # Base classes for commands/events
│   ├── typings/          # Custom TypeScript types
│   ├── utils/            # Utility modules (logger, etc.)
│   └── index.ts          # Entry point
├── package.json
├── tsconfig.json
├── biome.json
└── pnpm-lock.yaml
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

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (preferred) or npm/yarn
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
   pnpm install
   # or
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in required values (e.g., `TOKEN`, `CLIENT_ID`, `DATABASE_URL`).

4. **Set up the database:**
   ```sh
   pnpm exec prisma migrate dev
   # or
   npx prisma migrate dev
   ```

5. **Generate Prisma client:**
   ```sh
   pnpm exec prisma generate
   ```

### Running the Bot

- **Development mode (with hot-reload):**
  ```sh
  bun run src/index.ts --watch
  ```

- **Production mode:**
  ```sh
  bun src/index.ts
  ```

### Debugging

- VSCode launch configuration is provided in `.vscode/launch.json` for debugging with breakpoints.

## Usage & Extensibility

### Adding Commands

- **Prefix Commands:** Place new command files in `src/commands/prefix/` and extend `BasePrefixCommand`.
- **Slash Commands:** Place new command files in `src/commands/slash/` and extend `BaseSlashCommand`.

Each command class receives the `CustomClient` instance for shared services (logger, database, config, etc.).

### Adding Events

- Place new event handler files in `src/events/` and ensure they extend the appropriate base event class.

### Localization

- Add or edit translation files in `src/locales/` (e.g., `EnglishUS.json`, `Vietnamese.json`).
- The i18n system is initialized automatically and supports dynamic language switching.

### Database

- Define new models in `prisma/schema/schema.prisma`.
- Run `pnpm exec prisma migrate dev` after schema changes.

## Development Standards

- **Code Quality:** Enforced by Biome (see `biome.json`).
- **Type Safety:** Strict TypeScript configuration (`tsconfig.json`).
- **Logging:** Use the provided logger (`src/utils/logger.ts`).
- **Error Handling:** All async operations should be wrapped with try/catch and logged.
- **Naming:** Use clear, descriptive names for files, classes, and functions.
- **Extensibility:** Favor composition and modularity for future features.

## Scripts

- `pnpm dev` — Start the bot in development mode (hot-reload).
- `pnpm start` — Start the bot in production mode.
- `pnpm exec prisma migrate dev` — Run database migrations.
- `pnpm exec prisma generate` — Generate Prisma client.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Create a new Pull Request

## License

[MIT](/LICENSE)