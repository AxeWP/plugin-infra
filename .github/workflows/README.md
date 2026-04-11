# GitHub Workflows

This directory contains GitHub Actions workflows for WordPress plugin development. Some are **reusable** workflows designed to be consumed by other repositories using `axewp/plugin-infra`; others are **internal** workflows for this repository's own CI/CD.

## Reusable Workflows

The following reusable workflows are available for consumption by downstream plugins:

| Workflow                                                                       | Purpose                              | Inputs                                                                                             |
| ------------------------------------------------------------------------------ | ------------------------------------ | -------------------------------------------------------------------------------------------------- |
| [reusable-phpunit.yml](reusable-phpunit.yml)                                   | Run PHPUnit tests                    | `php-version`, `wp-version`, `coverage`, `multisite`                                               |
| [reusable-codeception.yml](reusable-codeception.yml)                           | Run Codeception tests                | `php-version`, `wp-version`, `coverage`, `multisite`, `functional`, `acceptance`, `wpunit`, `unit` |
| [reusable-phpstan.yml](reusable-phpstan.yml)                                   | Run PHPStan static analysis          | `php-version`                                                                                      |
| [reusable-phpcs.yml](reusable-phpcs.yml)                                       | Run PHPCS coding standards           | `php-version`                                                                                      |
| [reusable-e2e.yml](reusable-e2e.yml)                                           | Run Playwright E2E tests             | `php-version`                                                                                      |
| [reusable-jest.yml](reusable-jest.yml)                                         | Run Jest unit tests                  | `coverage`                                                                                         |
| [reusable-lint-js.yml](reusable-lint-js.yml)                                   | Run ESLint, Stylelint, Prettier, TSC | None                                                                                               |
| [reusable-build.yml](reusable-build.yml)                                       | Build plugin artifact                | `php-version`, `artifact-name`, `artifact-path`                                                    |
| [reusable-wp-playground-pr-preview.yml](reusable-wp-playground-pr-preview.yml) | Post WP Playground preview           | `run-id`, `artifact-prefix`, `artifact-filename`, `artifacts-to-keep`                              |

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
  - `unit` (boolean, default: `true`): Run unit tests.
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

### reusable-lint-js.yml

Runs ESLint, Stylelint, Prettier, and TypeScript checks.

- **Inputs:** None.

### reusable-build.yml

Builds the plugin for production and creates a zip artifact.

- **Inputs:**
  - `php-version` (string, required): PHP version to use.
  - `artifact-name` (string, required): Name of the artifact to upload.
  - `artifact-path` (string, required): Path of the artifact to upload.

### reusable-wp-playground-pr-preview.yml

Posts a WordPress Playground preview button to Pull Request descriptions.

- **Inputs:**
  - `run-id` (string, required): The workflow run ID to download artifacts from.
  - `artifact-prefix` (string, default: `plugin-skeleton-d-pr`): Prefix for the artifact name.
  - `artifact-filename` (string, default: `plugin-skeleton-d.zip`): Filename of the zip inside the artifact.
  - `artifacts-to-keep` (string, default: `2`): Number of artifacts to keep per PR.

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
| `GITHUB_TOKEN`  | `reusable-wp-playground-pr-preview`, `pr-title.yml`         | Automatically provided by GitHub.                     |

## Usage Example

```yaml
# .github/workflows/ci.yml

name: CI
on: [push, pull_request]
jobs:
  lint:
    uses: AxeWP/plugin-infra/.github/workflows/reusable-lint-js.yml@main
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
