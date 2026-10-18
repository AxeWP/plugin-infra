# Upgrading

## From 0.3.x

### 1. Update `reusable-build.yml` callers

Replace `artifact-name` and `artifact-path` with `plugin-slug`:

```diff
 build:
   uses: AxeWP/plugin-infra/.github/workflows/reusable-build.yml@main
   with:
     php-version: '8.4'
-    artifact-name: my-plugin
-    artifact-path: my-plugin.zip
+    plugin-slug: my-plugin
```

`npm run plugin-zip` must create `<plugin-slug>.zip`, with its files in a `<plugin-slug>/` folder. The artifact is named `plugin-zip-<plugin-slug>`.

### 2. Update jobs that download the build

```diff
 - uses: actions/download-artifact@<sha> # v8
   with:
-    name: my-plugin
+    name: plugin-zip-my-plugin
```

### 3. Add a `test:php:multisite` script if you use `multisite: true`

`reusable-phpunit.yml` now runs `npm run test:php:multisite` for multisite, instead of passing `--multisite` to `wp-env`.

### 4. Optional: adopt the new workflows

| Workflow                             | Add it as                                                 | Caller permissions                                         |
| ------------------------------------ | --------------------------------------------------------- | ---------------------------------------------------------- |
| `reusable-wp-plugin-check.yml`       | A `ci.yml` job with `needs: build`                        | `pull-requests: write`                                     |
| `reusable-wp-playground-preview.yml` | A new `workflow_run` workflow, triggered when CI finishes | `actions: read`, `contents: write`, `pull-requests: write` |
| `reusable-pr-cleanup.yml`            | A new `pull_request_target` (`closed`) workflow           | `contents: write`                                          |
| `reusable-actionlint.yml`            | A `ci.yml` job                                            | `contents: read`                                           |

See [`.github/workflows/README.md`](.github/workflows/README.md) for inputs and examples.

### Other changes

- New `working-directory` input on the PHP, E2E, build and GraphQL workflows, for plugins in a subdirectory. npm dependencies still install at the repository root.
- New optional `plugin-slug` input on `reusable-phpunit.yml`, `reusable-codeception.yml` and `reusable-e2e.yml`, appended to their artifact names.
- The GraphQL schema linter artifact is now named `generated-schema-<plugin-slug>.graphql`.
- PHPCS and PHPStan caches use new keys, so the first run starts cold.
- `reusable-js-lints.yml` no longer runs the linters when `npm ci` fails.
