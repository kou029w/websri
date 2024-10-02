import assert from "node:assert/strict";
import { test } from "node:test";
import { IntegrityMetadata } from "../../src/index.ts";

test("IntegrityMetadata like object can be serialized", function () {
  assert.strictEqual(
    IntegrityMetadata.stringify({
      alg: "sha256",
      val: "MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
    }),
    "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
  );
});
