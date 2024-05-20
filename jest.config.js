// jest.setup.js

// jest.config.js
module.exports = {
  setupFilesAfterEnv: ["./jest.setup.js"],
  preset: "ts-jest",
  testEnvironment: "node",
};
