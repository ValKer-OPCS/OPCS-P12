import nextJest from "next/jest.js";
import type { Config } from "jest";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  testEnvironment: "jsdom",

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",

    "\\.(css|scss|sass)$": "identity-obj-proxy",

    "\\.(png|jpg|jpeg|gif|svg|webp)$": "test-file-stub",
  },


  setupFilesAfterEnv: ["<rootDir>/jest.setup.tsx"],

  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
  ],

  clearMocks: true,
};

export default createJestConfig(config);
