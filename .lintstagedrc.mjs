/**
 * @type {import('lint-staged').Configuration}
 */
export default {
	'**/*.{md,css,scss,*js,jsx,ts,tsx}': [ 'prettier --write' ],
	'**/*.{json,*js,jsx,ts,tsx}': [ 'eslint --fix --no-warn-ignored' ],
};
