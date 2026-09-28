/**
 * ESLint config for this repo: dogfoods the shared config for `.mjs` files and
 * lints JSON with `@eslint/json`.
 */

import json from '@eslint/json';
import base from './configs/eslint.mjs';

/** @type {import('eslint').Linter.Config[]} */
export default [
	// Keep ignore-only objects global; scope everything else to `.mjs`.
	...base.map( ( config ) =>
		Object.keys( config ).length === 1 && config.ignores
			? config
			: { files: [ '**/*.mjs' ], ...config }
	),

	// The shared config ignores consumer config files; lint ours.
	{
		ignores: [
			'!eslint.config.mjs',
			'!.lintstagedrc.mjs',
			'!.prettierrc.mjs',
		],
	},

	{
		files: [ '*.mjs', 'examples/*.mjs', 'configs/*.mjs' ],
		rules: {
			'import/no-extraneous-dependencies': [
				'error',
				{ devDependencies: true },
			],
		},
	},

	{
		files: [ '**/*.json' ],
		ignores: [ 'package-lock.json' ],
		plugins: { json },
		language: 'json/json',
		...json.configs.recommended,
	},

	{
		files: [ '**/tsconfig.json' ],
		language: 'json/jsonc',
	},
];
