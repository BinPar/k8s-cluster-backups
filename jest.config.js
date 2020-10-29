module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!<rootDir>/node_modules/',
    '!<rootDir>/src/index.ts',
  ],
  testTimeout: 30000,
};
