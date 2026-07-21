// Copy to your plugin root as `eslint.config.mjs` and replace
// `your-plugin-name` with your plugin's text domain.
import base from '@axepress/plugin-infra/eslint';

export default [
	...base,

	// Project-specific customizations on top of the shared config.
	{
		rules: {
			// i18n text domain enforcement for this plugin
			'@wordpress/i18n-text-domain': [
				'error',
				{
					allowedTextDomain: 'your-plugin-name',
				},
			],
		},
	},
];
