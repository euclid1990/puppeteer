module.exports = {
  preset: 'jest-puppeteer',
  globals: {
    FRONTEND_URL: 'http://localhost:3000',
    API_URL: 'http://localhost:4000/api',
    API_HEATHCHECK_URL: 'http://localhost:4000/api/healthcheck'
  },
  testMatch: [
    '**/test/**/*.test.js'
  ],
  verbose: true
}
