/**
 * Shared Prettier config for AxeWP plugins.
 *
 * `.prettierrc.mjs`:
 *
 *     export { default } from '@axepress/plugin-infra/prettier';
 *
 * @see https://prettier.io/docs/configuration
 */

import wpConfig from '@wordpress/prettier-config';

/**
 * @type {import("prettier").Config}
 */
export default {
	...wpConfig,
	overrides: [
		...wpConfig.overrides,
		// `.editorconfig` parity.
		{
			files: '*.md',
			options: {
				tabWidth: 2,
				useTabs: false,
			},
		},
		{
			files: [ '*.yml', '*.yaml' ],
			options: {
				tabWidth: 2,
				useTabs: false,
				singleQuote: true,
			},
		},
	],
};
