/**
 * Shared ESLint (flat) config for AxeWP plugins.
 *
 * `eslint.config.mjs`:
 *
 *     export { default } from '@axepress/plugin-infra/eslint';
 *
 * Flat config is additive, so customize by appending your own objects —
 * including `ignores`. Set your text domain here; `@wordpress/i18n-text-domain`
 * comes from `@wordpress/eslint-plugin`'s recommended config and defaults to
 * `default`:
 *
 *     import base from '@axepress/plugin-infra/eslint';
 *
 *     export default [
 *         ...base,
 *         {
 *             rules: {
 *                 '@wordpress/i18n-text-domain': [
 *                     'error',
 *                     { allowedTextDomain: 'your-plugin-name' },
 *                 ],
 *             },
 *         },
 *         { ignores: [ 'packages/**' ] },
 *     ];
 *
 * @see https://eslint.org/docs/latest/use/configure/configuration-files
 */

import wordpress from '@wordpress/eslint-plugin';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{
		ignores: [
			'**/*.min.js',
			'build/**',
			'tests/_output/**',
			'vendor/**',
			'eslint.config.mjs',
			'.lintstagedrc.mjs',
			'.prettierrc.js',
			'.prettierrc.mjs',
		],
	},

	...wordpress.configs.recommended,

	{
		rules: {
			'@wordpress/no-unsafe-wp-apis': 'error',

			'@wordpress/i18n-hyphenated-range': 'error',
			'@wordpress/i18n-no-flanking-whitespace': 'error',

			'@wordpress/data-no-store-string-literals': 'error',
			'@wordpress/wp-global-usage': 'error',
			'@wordpress/react-no-unsafe-timeout': 'error',
			// Not version-stable yet.
			'@wordpress/use-recommended-components': 'warn',

			'react/jsx-boolean-value': 'error',
			'react/jsx-curly-brace-presence': [
				'error',
				{
					props: 'never',
					children: 'never',
				},
			],

			'import/default': 'error',
			'import/named': 'error',
			'import/no-extraneous-dependencies': [
				'error',
				{
					devDependencies: [
						'**/*.@(spec|test).@(j|t)s?(x)',
						'**/@(webpack|babel|playwright|vite|vitest).config.@(j|t)s',
						'**/vitest.setup.@(j|t)s',
						'**/scripts/**',
						'**/tests/**',
						'**/__tests__/**',
					],
				},
			],

			'no-restricted-imports': [
				'error',
				{
					paths: [
						{
							name: 'lodash',
							message: 'Please use native functionality instead.',
						},
						{
							name: 'classnames',
							message:
								"Please use `clsx` instead. It's a lighter and faster drop-in replacement for `classnames`.",
						},
						{
							name: 'redux',
							importNames: [ 'combineReducers' ],
							message:
								'Please use `combineReducers` from `@wordpress/data` instead.',
						},
					],
				},
			],

			'no-restricted-syntax': [
				'error',
				{
					selector:
						'ImportDeclaration[source.value=/^@wordpress\\u002F.+\\u002F/]',
					message:
						'Path access on WordPress dependencies is not allowed.',
				},
				{
					selector:
						'JSXAttribute[name.name="id"][value.type="Literal"]',
					message:
						'Do not use string literals for IDs; use withInstanceId instead.',
				},
				{
					selector:
						'CallExpression[callee.object.name="Math"][callee.property.name="random"]',
					message:
						"Do not use Math.random() to generate unique IDs; use withInstanceId instead. (If you're not generating unique IDs: ignore this message.)",
				},
			],
		},
	},

	{
		files: [ '**/*.ts?(x)' ],
		rules: {
			'@typescript-eslint/consistent-type-imports': [
				'error',
				{
					prefer: 'type-imports',
					disallowTypeAnnotations: false,
				},
			],
			'@typescript-eslint/no-shadow': 'error',
			'dot-notation': 'off',
			'no-shadow': 'off',
			'jsdoc/require-param': 'off',
			'jsdoc/require-param-type': 'off',
			'jsdoc/require-returns-type': 'off',
		},
	},

	// Vitest unit tests, scoped like `wp-scripts lint-js`.
	...wordpress.configs[ 'test-unit' ].map( ( config ) => ( {
		...config,
		files: [
			'**/@(test|__tests__)/**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}',
			'**/*.@(test|spec).{js,jsx,ts,tsx,mjs,cjs,mts,cts}',
			'tests/js/**/*.{ts,tsx}',
		],
		rules: {
			...config.rules,
			'vitest/no-commented-out-tests': 'warn',
			'vitest/prefer-to-have-length': 'warn',
		},
	} ) ),

	{
		files: [ 'tests/e2e/**/*.{ts,tsx}' ],
		rules: {
			'jsdoc/no-undefined-types': 'off',
		},
	},
];
