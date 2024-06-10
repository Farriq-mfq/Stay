module.exports = {
    testMatch: ['**/*.test.js'], // Specify the test file pattern
    collectCoverageFrom: ['src/**/*.js'], // Specify the files to collect coverage from
    coverageReporters: ['text', 'html'], // Specify the coverage reporters,s
    testEnvironment: 'jsdom'
};