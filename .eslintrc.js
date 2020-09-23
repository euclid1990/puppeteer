module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  globals: {
    test: true,
    describe: true,
    beforeAll: true,
    expect: true,
    page: true,
    FRONTEND_URL: true,
    API_HEATHCHECK_URL: true,
    API_URL: true
  },
  rules: {
    'no-unexpected-multiline': 'off',
    'func-call-spacing': 'off'
  }
}
