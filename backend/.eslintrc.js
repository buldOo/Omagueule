process.env.ESLINT_TSCONFIG = 'tsconfig.json';

module.exports = {
  rules: {
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ]
  }
};
