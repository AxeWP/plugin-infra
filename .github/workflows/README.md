# GitHub Workflows

This directory contains GitHub Actions workflows for WordPress plugin development. Some are **reusable** workflows designed to be consumed by other repositories using `axewp/plugin-infra`; others are **internal** workflows for this repository's own CI/CD.

Examples reference `@main`. **Pin a release tag or commit SHA in a real project to ensure stability.**

## Reusable Workflows

The following reusable workflows are available for consumption by downstream plugins:

| Workflow                                                                   | Purpose                                      | Inputs                                                                                                                         |
| -------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| [reusable-phpunit.yml](reusable-phpunit.yml)                               | Run PHPUnit tests                            | `php-version`, `wp-version`, `coverage`, `multisite`, `working-directory`, `plugin-slug`                                       |
| [reusable-codeception.yml](reusable-codeception.yml)                       | Run Codeception tests                        | `php-version`, `wp-version`, `coverage`, `multisite`, `functional`, `acceptance`, `wpunit`, `working-directory`, `plugin-slug` |
| [reusable-phpstan.yml](reusable-phpstan.yml)                               | Run PHPStan static analysis                  | `php-version`, `working-directory`                                                                                             |
| [reusable-phpcs.yml](reusable-phpcs.yml)                                   | Run PHPCS coding standards                   | `php-version`, `working-directory`                                                                                             |
| [reusable-e2e.yml](reusable-e2e.yml)                                       | Run Playwright E2E tests                     | `php-version`, `working-directory`, `plugin-slug`                                                                              |
| [reusable-js-test.yml](reusable-js-test.yml)                               | Run JS unit tests (`npm run test:js`)        | `coverage`                                                                                                                     |
| [reusable-js-lints.yml](reusable-js-lints.yml)                             | Run ESLint, Stylelint, Prettier, TSC         | `eslint`, `stylelint`, `prettier`, `tsc`                                                                                       |
| [reusable-build.yml](reusable-build.yml)                                   | Build plugin artifact                        | `php-version`, `plugin-slug`, `working-directory`                                                                              |
| [reusable-wp-plugin-check.yml](reusable-wp-plugin-check.yml)               | Run WordPress Plugin Check on the built zip  | `plugin-slug`, `wp-version`, Plugin Check options                                                                              |
| [reusable-wp-playground-preview.yml](reusable-wp-playground-preview.yml)   | Post a WordPress Playground PR preview       | `blueprint-path`                                                                                                               |
| [reusable-pr-cleanup.yml](reusable-pr-cleanup.yml)                         | Delete a closed PR's Playground preview zips | `pr-number`                                                                                                                    |
| [reusable-actionlint.yml](reusable-actionlint.yml)                         | Lint GitHub workflows with actionlint        | –                                                                                                                              |
| [reusable-graphql-schema-linter.yml](reusable-graphql-schema-linter.yml)   | Lint WPGraphQL schema + breaking-change diff | `php-version`, `plugin-slug`, `previous-schema-url`, `working-directory`                                                       |
| [reusable-upload-schema-artifact.yml](reusable-upload-schema-artifact.yml) | Upload `schema.graphql` to a GitHub release  | `php-version`, `plugin-slug`, `release-tag`, `working-directory`                                                               |

---

### reusable-phpunit.yml

Runs PHPUnit tests in a Docker environment using `wp-env`.

- **Inputs:**
  - `php-version` (string, required): PHP version to use.
  - `wp-version` (string, default: `latest`): WordPress version (`latest`, `trunk`, or `X.Y`).
  - `coverage` (boolean, default: `false`): Enable code coverage.
  - `multisite` (boolean, default: `false`): Run multisite tests with `npm run test:php:multisite`.
  - `working-directory` (string, default: `.`): Plugin directory, relative to the repository root.
  - `plugin-slug` (string, default: `''`): Appended to artifact names.
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
  - `working-directory` (string, default: `.`): Plugin directory, relative to the repository root.
  - `plugin-slug` (string, default: `''`): Appended to artifact names.
- **Secrets:**
  - `CODECOV_TOKEN` (optional): Token for uploading coverage to Codecov.

### reusable-phpstan.yml

Runs PHPStan static analysis.

- **Inputs:**
  - `php-version` (string, required): PHP version to use.
  - `working-directory` (string, default: `.`): Plugin directory, relative to the repository root.

### reusable-phpcs.yml

Runs PHPCS coding standards check.

- **Inputs:**
  - `php-version` (string, required): PHP version to use.
  - `working-directory` (string, default: `.`): Plugin directory, relative to the repository root.

### reusable-e2e.yml

Runs Playwright E2E tests.

- **Inputs:**
  - `php-version` (string, required): PHP version to use.
  - `working-directory` (string, default: `.`): Plugin directory, relative to the repository root.
  - `plugin-slug` (string, default: `''`): Appended to artifact names.

### reusable-js-test.yml

Runs JavaScript unit tests via `npm run test:js` (or `test:js:coverage`). Runner-agnostic: use whatever your project wires up (e.g. `wp-scripts test-unit-js`).

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

Builds the plugin for production and uploads `<plugin-slug>.zip` (from `npm run plugin-zip`) as an artifact named `plugin-zip-<plugin-slug>`.

- **Inputs:**
  - `php-version` (string, required): PHP version to use.
  - `plugin-slug` (string, required): Plugin slug. The zip's files must be in a `<plugin-slug>/` folder.
  - `working-directory` (string, default: `.`): Plugin directory, relative to the repository root.

### reusable-wp-plugin-check.yml

Runs [WordPress Plugin Check](https://github.com/WordPress/plugin-check-action) against the zip built by `reusable-build.yml` in the same workflow run.

- **Inputs:**
  - `plugin-slug` (string, required): The `plugin-slug` passed to `reusable-build.yml`.
  - `wp-version` (string, default: `latest`): `latest` or `trunk`.
  - `checks`, `exclude-checks`, `categories`, `exclude-files`, `exclude-directories`, `ignore-codes` (string, default: `''`): Newline-separated lists passed to Plugin Check.
  - `ignore-warnings`, `include-experimental`, `strict` (boolean, default: `false`): Passed to Plugin Check.
- **Permissions:** The caller must grant `pull-requests: write` so Plugin Check can comment on the PR.

**Example Usage:**

```yaml
jobs:
  build:
    uses: AxeWP/plugin-infra/.github/workflows/reusable-build.yml@main
    with:
      php-version: '8.4'
      plugin-slug: 'my-plugin'

  plugin-check:
    needs: build
    uses: AxeWP/plugin-infra/.github/workflows/reusable-wp-plugin-check.yml@main
    permissions:
      pull-requests: write
    with:
      plugin-slug: 'my-plugin'
```

### reusable-wp-playground-preview.yml

Uploads the `plugin-zip-*` artifacts from a CI run to the `ci-artifacts` prerelease, replacing the PR's previous ones, and adds a [WordPress Playground](https://github.com/WordPress/action-wp-playground-pr-preview) preview button that installs them to the PR.

- **Inputs:**
  - `blueprint-path` (string, default: `''`): Path to a [Blueprint](https://wordpress.github.io/wordpress-playground/blueprints/) on the default branch. `{{ARTIFACT_URL:<slug>}}` is replaced with the URL of that plugin's PR build. Empty installs and activates the built plugins.
- **Permissions:** The caller must grant `actions: read`, `contents: write` and `pull-requests: write`.
- **Consumer requirements:** Must be called from a `workflow_run` trigger. Public repositories only.

**Example Usage:**

```yaml
# .github/workflows/wp-playground-pr-preview.yml
name: WordPress Playground PR Preview

on:
  workflow_run:
    workflows: ['CI']
    types: [completed]

permissions: {}

jobs:
  playground-preview:
    if: github.event.workflow_run.event == 'pull_request' && github.event.workflow_run.conclusion == 'success'
    uses: AxeWP/plugin-infra/.github/workflows/reusable-wp-playground-preview.yml@main
    permissions:
      actions: read
      contents: write
      pull-requests: write
    with:
      blueprint-path: 'blueprint.json'
```

### reusable-pr-cleanup.yml

Deletes a closed PR's Playground preview zips from the `ci-artifacts` release.

- **Inputs:**
  - `pr-number` (number, required): Number of the closed PR.
- **Permissions:** The caller must grant `contents: write`.
- **Consumer requirements:** Must be called from a `pull_request_target` trigger, without checking out PR code.

**Example Usage:**

```yaml
# .github/workflows/pr-cleanup.yml
name: PR Cleanup

on:
  pull_request_target:
    types: [closed]

permissions: {}

jobs:
  cleanup:
    uses: AxeWP/plugin-infra/.github/workflows/reusable-pr-cleanup.yml@main
    permissions:
      contents: write
    with:
      pr-number: ${{ github.event.pull_request.number }}
```

### reusable-actionlint.yml

Lints the caller's GitHub workflows with [actionlint](https://github.com/rhysd/actionlint). Bump `ACTIONLINT_VERSION` and `ACTIONLINT_SHA256` together by hand.

### reusable-graphql-schema-linter.yml

Generates a static GraphQL schema via `wp-env`, lints it with the consumer's `npm run lint:schema` script, and optionally diffs it against a previously-released schema for breaking changes.

- **Inputs:**
  - `php-version` (string, required): PHP version to use.
  - `plugin-slug` (string, required): Plugin directory name inside `wp-content/plugins/`.
  - `working-directory` (string, default: `.`): Plugin directory, relative to the repository root.
  - `previous-schema-url` (string, default: `''`): URL to a released `schema.graphql`. When set, runs `graphql-inspector diff` against it.
- **Artifacts:**
  - `generated-schema-<plugin-slug>.graphql`: uploaded even on lint failure (14-day retention).
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
  - `working-directory` (string, default: `.`): Plugin directory, relative to the repository root.
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
| [ci.yml](ci.yml)                                   | Push to `main`, PRs to `main`/`release/**`                | Lint `composer.json`, Prettier, ESLint, workflows |
| [release.yml](release.yml)                         | Push to `main`, `workflow_dispatch`                       | Automated releases via `release-please`           |
| [pr-title.yml](pr-title.yml)                       | PR events (open, sync, edit, reopen, ready)               | Validate PR titles follow Conventional Commits    |
| [copilot-setup-steps.yml](copilot-setup-steps.yml) | Push/PR to `copilot-setup-steps.yml`, `workflow_dispatch` | Configure GitHub Copilot coding agent environment |

---

## Secrets

| Secret          | Required By                                                    | Notes                                                 |
| --------------- | -------------------------------------------------------------- | ----------------------------------------------------- |
| `CODECOV_TOKEN` | `reusable-phpunit`, `reusable-js-test`, `reusable-codeception` | Optional — coverage uploads fail silently if missing. |
| `GITHUB_TOKEN`  | `pr-title.yml`                                                 | Automatically provided by GitHub.                     |

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
