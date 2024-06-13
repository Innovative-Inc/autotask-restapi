import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    typecheck: {
      // Leave disabled by default, will be enabled as-needed by the test runner.
      // When type-checking, this specifies to ONLY check types. This works around some issues with @apigrate's code.
      only: true,
    },
  },
});
