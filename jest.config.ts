import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts', '!**/node_modules/**', '!src/index.ts'],
  silent: true,
};

export default config;
