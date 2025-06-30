export default {
	'**/*.(ts)': (filenames) => [
		'yarn build',
		// 'yarn type-check',
		`yarn eslint --fix ${filenames.join(' ')}`,
		`yarn prettier --write ${filenames.join(' ')}`,
	],
};
