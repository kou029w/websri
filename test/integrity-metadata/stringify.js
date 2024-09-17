import assert from "node:assert/strict";
import { test } from "node:test";
import { IntegrityMetadata } from "../../dist/index.js";

test("IntegrityMetadata like object can be serialized", function () {
  const integrityMetadataLike = {
    alg: "sha256",
    val: "MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
  };

  assert.strictEqual(
    IntegrityMetadata.stringify(integrityMetadataLike),
    "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
  );
});
