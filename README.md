# SolidStart

Everything you need to build a Solid project, powered by [`solid-start`](https://start.solidjs.com);

## Creating a project

```bash
# create a new project in the current directory
bun create solid
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
bun dev

# or start the server and open the app in a new browser tab
bun dev -- --open
```

## Updating dependencies

Show the dependencies that would be updated if you ran the update

```bash
bun outdated
```

Run the update

```bash
bun update
```

## Building

Solid apps are built with _presets_, which optimise your project for deployment to different environments.

By default, `bun run build` will generate a Node app that you can run with `bun start`. To use a different preset, add it to the `devDependencies` in `package.json` and specify in your `app.config.js`.

## This project was created with the [Solid CLI](https://solid-cli.netlify.app)
