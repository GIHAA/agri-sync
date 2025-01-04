module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  verbose: true,
  clearMocks: true,
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './back-end/seed-transaction-service',  // Adjust as needed
      outputName: 'junit.xml', // Ensure this file name matches what you're using
    }]
  ],
};
