/**
 * @type {import('lint-staged').Configuration}
 */
export default {
	'**/*.{json,md,css,scss,js,jsx,ts,tsx}': [ 'prettier --write' ],
};
