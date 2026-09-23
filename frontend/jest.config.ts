/** @jest-config-loader ts-node */

import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  moduleNameMapper: {
    "^@frontend/(.*)$": "<rootDir>/$1",
    "^@common/(.*)$": "<rootDir>/../common/$1",
    "^swiper/css.*$":
      "<rootDir>/node_modules/next/dist/build/jest/__mocks__/styleMock.js",
  },
  modulePathIgnorePatterns: ["<rootDir>/.next/"],
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],
  testEnvironment: "jsdom",
  testMatch: ["**/__tests__/**/*.test.tsx"],
};

export default createJestConfig(config);
