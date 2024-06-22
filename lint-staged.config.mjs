export default {
  '**/*.(ts)': (filenames) => [
    'yarn build',
    `yarn eslint --fix ${filenames.join(' ')}`,
    `yarn prettier --write ${filenames.join(' ')}`
  ]
};
