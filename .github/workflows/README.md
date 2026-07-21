# GitHub Workflows

This directory contains GitHub Actions workflows for WordPress plugin development. Some are **reusable** workflows designed to be consumed by other repositories using `axewp/plugin-infra`; others are **internal** workflows for this repository's own CI/CD.

## Reusable Workflows

The following reusable workflows are available for consumption by downstream plugins:

| Workflow                                                                   | Purpose                                      | Inputs                                                                                     |
| -------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| [reusable-phpunit.yml](reusable-phpunit.yml)                               | Run PHPUnit tests                            | `php-version`, `wp-version`, `coverage`, `multisite`                                       |
| [reusable-codeception.yml](reusable-codeception.yml)                       | Run Codeception tests                        | `php-version`, `wp-version`, `coverage`, `multisite`, `functional`, `acceptance`, `wpunit` |
| [reusable-phpstan.yml](reusable-phpstan.yml)                               | Run PHPStan static analysis                  | `php-version`                                                                              |
| [reusable-phpcs.yml](reusable-phpcs.yml)                                   | Run PHPCS coding standards                   | `php-version`                                                                              |
| [reusable-e2e.yml](reusable-e2e.yml)                                       | Run Playwright E2E tests                     | `php-version`                                                                              |
| [reusable-jest.yml](reusable-jest.yml)                                     | Run Jest unit tests                          | `coverage`                                                                                 |
| [reusable-js-lints.yml](reusable-js-lints.yml)                             | Run ESLint, Stylelint, Prettier, TSC         | `eslint`, `stylelint`, `prettier`, `tsc`                                                   |
| [reusable-build.yml](reusable-build.yml)                                   | Build plugin artifact                        | `php-version`, `artifact-name`, `artifact-path`                                            |
| [reusable-graphql-schema-linter.yml](reusable-graphql-schema-linter.yml)   | Lint WPGraphQL schema + breaking-change diff | `php-version`, `plugin-slug`, `previous-schema-url`                                        |
| [reusable-upload-schema-artifact.yml](reusable-upload-schema-artifact.yml) | Upload `schema.graphql` to a GitHub release  | `php-version`, `plugin-slug`, `release-tag`                                                |

---

### reusable-phpunit.yml

Runs PHPUnit tests in a Docker environment using `wp-env`.

- **Inputs:**
  - `php-version` (string, required): PHP version to use.
  - `wp-version` (string, default: `latest`): WordPress version (`latest`, `trunk`, or `X.Y`).
  - `coverage` (boolean, default: `false`): Enable code coverage.
  - `multisite` (boolean, default: `false`): Run multisite tests.
- **Secrets:**
  - `CODECOV_TOKEN` (optional): Token for uploading coverage to Codecov.

**Example Usage:**

```yaml
jobs:
  phpunit:
    uses: AxeWP/plugin-infra/.github/workflows/reusable-phpunit.yml@main
    with:
      php-version: '8.3'
      wp-version: 'latest'
      coverage: true
    secrets:
      CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
```

### reusable-codeception.yml

Runs Codeception acceptance, functional, and wpunit tests.

- **Inputs:**
  - `php-version` (string, required): PHP version to use.
  - `wp-version` (string, default: `latest`): WordPress version.
  - `coverage` (boolean, default: `false`): Enable code coverage.
  - `multisite` (boolean, default: `false`): Run multisite tests.
  - `functional` (boolean, default: `true`): Run functional tests.
  - `acceptance` (boolean, default: `true`): Run acceptance tests.
  - `wpunit` (boolean, default: `true`): Run WPUnit tests.
- **Secrets:**
  - `CODECOV_TOKEN` (optional): Token for uploading coverage to Codecov.

### reusable-phpstan.yml

Runs PHPStan static analysis.

- **Inputs:**
  - `php-version` (string, required): PHP version to use.

### reusable-phpcs.yml

Runs PHPCS coding standards check.

- **Inputs:**
  - `php-version` (string, required): PHP version to use.

### reusable-e2e.yml

Runs Playwright E2E tests.

- **Inputs:**
  - `php-version` (string, required): PHP version to use.

### reusable-jest.yml

Runs Jest unit tests for JavaScript.

- **Inputs:**
  - `coverage` (boolean, default: `true`): Enable code coverage.
- **Secrets:**
  - `CODECOV_TOKEN` (optional): Token for uploading coverage to Codecov.

### reusable-js-lints.yml

Runs ESLint, Stylelint, Prettier, and TypeScript checks.

- **Inputs:**
  - `eslint` (boolean, default: `true`): Run ESLint.
  - `stylelint` (boolean, default: `true`): Run Stylelint.
  - `prettier` (boolean, default: `true`): Run Prettier.
  - `tsc` (boolean, default: `true`): Run TypeScript

### reusable-build.yml

Builds the plugin for production and creates a zip artifact.

- **Inputs:**
  - `php-version` (string, required): PHP version to use.
  - `artifact-name` (string, required): Name of the artifact to upload.
  - `artifact-path` (string, required): Path of the artifact to upload.

### reusable-graphql-schema-linter.yml

Generates a static GraphQL schema via `wp-env`, lints it with the consumer's `npm run lint:schema` script, and optionally diffs it against a previously-released schema for breaking changes.

- **Inputs:**
  - `php-version` (string, required): PHP version to use.
  - `plugin-slug` (string, required): Plugin directory name inside `wp-content/plugins/`.
  - `previous-schema-url` (string, default: `''`): URL to a released `schema.graphql`. When set, runs `graphql-inspector diff` against it.
- **Artifacts:**
  - `generated-schema.graphql`: uploaded even on lint failure (14-day retention).
- **Consumer requirements:**
  - A `lint:schema` npm script (e.g. `graphql-schema-linter --rules ... tests/_output/schema.graphql`). `graphql-schema-linter@3.x` peers on `graphql@^15 || ^16`, so pin `graphql` to `^16.0.0`.
  - A `.wp-env.test.json` and `wp-env:test` npm script, with WPGraphQL installed as a `wp-env` plugin.
  - `@graphql-inspector/cli` as a devDependency, if using `previous-schema-url`.

**Example Usage:**

```yaml
jobs:
  schema-linter:
    uses: AxeWP/plugin-infra/.github/workflows/reusable-graphql-schema-linter.yml@main
    with:
      php-version: '8.4'
      plugin-slug: 'my-plugin'
      previous-schema-url: 'https://github.com/axewp/my-plugin/releases/latest/download/schema.graphql'
```

`previous-schema-url` requires a `schema.graphql` asset on the release. Use `reusable-upload-schema-artifact.yml` to publish one.

### reusable-upload-schema-artifact.yml

Generates a static GraphQL schema via `wp-env` and uploads it as a GitHub release asset, available at `https://github.com/<owner>/<repo>/releases/download/<tag>/schema.graphql`.

- **Inputs:**
  - `php-version` (string, required): PHP version to use.
  - `plugin-slug` (string, required): Plugin directory name inside `wp-content/plugins/`.
  - `release-tag` (string, default: `''`): Release tag to upload to. Defaults to `github.event.release.tag_name`. Pass an explicit tag for `workflow_dispatch` runs.
- **Permissions:** The caller must grant `contents: write` — a reusable workflow can only narrow the caller's token, never widen it.
- **Consumer requirements:** A `.wp-env.test.json` and `wp-env:test` npm script, with WPGraphQL installed as a `wp-env` plugin.

**Example Usage:**

```yaml
on:
  release:
    types: [published]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  upload-schema:
    uses: AxeWP/plugin-infra/.github/workflows/reusable-upload-schema-artifact.yml@main
    with:
      php-version: '8.4'
      plugin-slug: 'my-plugin'
```

---

## Internal Workflows

The following workflows are used internally by this repository and are not designed for reuse:

| Workflow                                           | Trigger                                                   | Purpose                                           |
| -------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------- |
| [ci.yml](ci.yml)                                   | Push to `main`, PRs to `main`/`release/**`                | Lint `composer.json`, check Prettier formatting   |
| [release.yml](release.yml)                         | Push to `main`, `workflow_dispatch`                       | Automated releases via `release-please`           |
| [pr-title.yml](pr-title.yml)                       | PR events (open, sync, edit, reopen, ready)               | Validate PR titles follow Conventional Commits    |
| [copilot-setup-steps.yml](copilot-setup-steps.yml) | Push/PR to `copilot-setup-steps.yml`, `workflow_dispatch` | Configure GitHub Copilot coding agent environment |

---

## Secrets

| Secret          | Required By                                                 | Notes                                                 |
| --------------- | ----------------------------------------------------------- | ----------------------------------------------------- |
| `CODECOV_TOKEN` | `reusable-phpunit`, `reusable-jest`, `reusable-codeception` | Optional — coverage uploads fail silently if missing. |
| `GITHUB_TOKEN`  | `pr-title.yml`                                              | Automatically provided by GitHub.                     |

## Usage Example

```yaml
# .github/workflows/ci.yml

name: CI
on: [push, pull_request]
jobs:
  lint:
    uses: AxeWP/plugin-infra/.github/workflows/reusable-js-lints.yml@main
    with:
      prettier: true
      tsc: false
  phpstan:
    uses: AxeWP/plugin-infra/.github/workflows/reusable-phpstan.yml@main
    with:
      php-version: '8.3'
  phpunit:
    uses: AxeWP/plugin-infra/.github/workflows/reusable-phpunit.yml@main
    with:
      php-version: '8.3'
    secrets:
      CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
```

## Local Testing

You can test these workflows locally using [act](https://github.com/nektos/act).

```bash
# Test a local workflow
act -W .github/workflows/ci.yml

# Test a reusable workflow directly, passing inputs and secrets
act -W .github/workflows/reusable-codeception.yml \
  --input php-version=8.3 \
  --input wp-version=latest \
  --input coverage=true \
  --input acceptance=false \
  --secret CODECOV_TOKEN=<your-token>
```
