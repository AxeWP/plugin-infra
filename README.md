# AxeWP Plugin Infrastructure

> Reusable dev infrastructure for AxeWP WordPress plugins.

`axewp/plugin-infra` is a GitHub repository providing reusable GitHub Workflows and shared configurations for AxePress public plugins.

## What's Included

### Reusable GitHub Actions Workflows

Reusable workflows under `.github/workflows/` for PHPUnit, Codeception, PHPStan, PHPCS, E2E (Playwright), Jest, CSS/JS linting, plugin builds, workflow linting, and GraphQL schema linting.

See [`.github/workflows/README.md`](.github/workflows/README.md) for full documentation, inputs, and copy-paste usage examples.

### Shareable Configs

Three configs carry enough shared rules to be worth versioning, so they are published to npm as `@axewp/plugin-infra`:

```bash
npm install --save-dev @axewp/plugin-infra
```

Each config file documents its own usage. Open the one you want:

| Tool          | Package                        | Config                                           | Example                                                    |
| ------------- | ------------------------------ | ------------------------------------------------ | ---------------------------------------------------------- |
| Prettier      | `@axewp/plugin-infra/prettier` | [`configs/prettier.mjs`](configs/prettier.mjs)   | [`examples/.prettierrc.mjs`](examples/.prettierrc.mjs)     |
| TypeScript    | `@axewp/plugin-infra/tsconfig` | [`configs/tsconfig.json`](configs/tsconfig.json) | [`examples/tsconfig.json`](examples/tsconfig.json)         |
| ESLint (flat) | `@axewp/plugin-infra/eslint`   | [`configs/eslint.mjs`](configs/eslint.mjs)       | [`examples/eslint.config.mjs`](examples/eslint.config.mjs) |

## Prior art

Inspired by https://github.com/johnbillion/plugin-infrastructure
