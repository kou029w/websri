import assert from "node:assert/strict";
import { test } from "node:test";
import { IntegrityMetadata } from "../../src/index.ts";

test("toString() can be used", function () {
  const integrityMetadata = new IntegrityMetadata(
    "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
  );

  assert.strictEqual(
    integrityMetadata.toString(),
    "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
  );
});
