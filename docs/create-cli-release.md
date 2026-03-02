# Create CLI Release Guide

Package: `@xirothedev/create-discord-app`
Location: `packages/create-discord-app`

## Release Checklist

1. Sync the bundled template snapshot:

```sh
bun scripts/sync-create-template.ts
```

2. Run generator tests:

```sh
bun test packages/create-discord-app/src/__tests__
```

3. Publish from the package directory:

```sh
cd packages/create-discord-app
npm publish --access public
```

4. Verify installation:

```sh
bunx @xirothedev/create-discord-app --help
```
