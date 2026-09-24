# Substack for Gloomberb

Your Substack subscriptions in [Gloomberb](https://github.com/gloom-sh/gloomberb) — inbox, per-publication archives, and full article reading without leaving the terminal.

Requires Gloomberb 0.15.0 or later. On the desktop the pane puts its Feed and subscription tabs in its own title bar, which 0.14 hosts cannot do ([Gloomberb #1091](https://github.com/gloom-sh/gloomberb/pull/1091)).

```bash
gloomberb install gloom-sh/gloom-substack
```

Then press `SUB` in the command bar.

## Signing in

The pane signs in with a Substack magic link, the same way the website does. The session is stored in Gloomberb's plugin persistence, scoped to this plugin.

## Terminal and desktop only

Substack's API sends no CORS headers, so the browser build at term.gloom.sh cannot reach it. The plugin declares `targets: ["cli", "tui", "desktop"]`, and the marketplace shows it accordingly.

## This used to ship with Gloomberb

It moved to its own repository so it can be released independently. Existing installs restore it automatically on first launch after upgrading; nothing is lost, and stored sessions and read state carry over because the plugin id is unchanged.

## Development

`gloomberb` and `react` are peer dependencies, never real ones — Gloomberb symlinks its own copies into every plugin directory so there is exactly one instance of each in the process. CI links the host the same way.

```bash
bun install
git clone --depth 1 https://github.com/gloom-sh/gloomberb.git /tmp/gloomberb
bun install --cwd /tmp/gloomberb
ln -sfn /tmp/gloomberb node_modules/gloomberb
ln -sfn /tmp/gloomberb/node_modules/react node_modules/react
bun run typecheck && bun test
```

## License

MIT
