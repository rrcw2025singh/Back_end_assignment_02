module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
}
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  // Tell Jest where the tests are
  roots: ["<rootDir>/tests"],

  // Specify the pattern for test files
  testMatch: ["**/*.test.ts"],
};