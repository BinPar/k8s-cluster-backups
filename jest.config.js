module.exports = {
  roots: ['<rootDir>/src'],
  testMatch: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{ts}',
    '!<rootDir>/node_modules/',
    '!<rootDir>/src/index.ts',
  ],
};
