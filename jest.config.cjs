/** Jest configuration for the Srytal frontend unit tests (src/tests/**.spec.tsx). */
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/tests/**/*.spec.{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/jest/setup.tsx'],

  transform: {
    '^.+\\.(t|j)sx?$': ['babel-jest', { configFile: './babel.jest.cjs' }],
  },
  // Most deps ship CJS; nothing needs transforming out of node_modules.
  transformIgnorePatterns: ['/node_modules/'],

  // Order matters — asset/CSS/lib rules must precede the broad `^@/` alias so
  // imports like `@/assets/logo.png` map to the file stub, not `src/...png`.
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpe?g|gif|svg|webp|avif|ico)$': '<rootDir>/jest/fileMock.cjs',
    '^@tabler/icons-react$': '<rootDir>/jest/iconsMock.cjs',
    '^react-markdown$': '<rootDir>/jest/reactMarkdownMock.tsx',
    '^remark-gfm$': '<rootDir>/jest/emptyMock.cjs',
    '^@test-utils$': '<rootDir>/jest/test-utils.tsx',
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/main.tsx',
    '!src/**/*.d.ts',
    '!src/vite-env.d.ts',
    '!src/mocks/**',
  ],
  coverageProvider: 'babel',
  coverageDirectory: '<rootDir>/coverage',

  clearMocks: true,
  testTimeout: 15000,
};
