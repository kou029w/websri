import assert from "node:assert/strict";
import { test } from "node:test";
import { IntegrityMetadataSet } from "../../src/index.ts";

test("if the hash values match, return true", function () {
  const integrityMetadata = new IntegrityMetadataSet(
    "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
  );

  assert.strictEqual(
    integrityMetadata.match({
      alg: "sha256",
      val: "MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
    }),
    true,
  );
});

test("if the hash of one of the selected algorithms matches, return true", function () {
  const integrityMetadata = new IntegrityMetadataSet([
    "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
    "sha256-uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek=",
  ]);

  assert.strictEqual(
    integrityMetadata.match({
      alg: "sha256",
      val: "MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
    }),
    true,
  );
});

test("a string can be specified", function () {
  const integrityMetadata = new IntegrityMetadataSet(
    "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
  );

  assert.strictEqual(
    integrityMetadata.match(
      "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
    ),
    true,
  );
});

test("if the hash algorithms are different, return false", function () {
  const integrityMetadata = new IntegrityMetadataSet(
    "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
  );

  assert.strictEqual(
    integrityMetadata.match({
      alg: "sha512",
      val: "MJ7MSJwS1utMxA9QyQLytNDtd+5RGnx6m808qG1M2G+YndNbxf9JlnDaNCVbRbDP2DDoH2Bdz33FVC6TrpzXbw==",
    }),
    false,
  );
});

test("if the hash values are different, return false", function () {
  const integrityMetadata = new IntegrityMetadataSet(
    "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
  );

  assert.strictEqual(
    integrityMetadata.match({
      alg: "sha256",
      val: "uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek=",
    }),
    false,
  );
});

test("if the hash algorithm is unsupported, return false", function () {
  const integrityMetadata = new IntegrityMetadataSet(
    "sha1-lDpwLQbzRZmu4fjajvn3KWAx1pk=",
  );

  assert.strictEqual(
    integrityMetadata.match("sha1-lDpwLQbzRZmu4fjajvn3KWAx1pk="),
    false,
  );
});

test("if null, return false", function () {
  const integrityMetadata = new IntegrityMetadataSet(null);

  assert.strictEqual(integrityMetadata.match(null), false);
});

test("if empty, return false", function () {
  const integrityMetadata = new IntegrityMetadataSet([]);

  assert.strictEqual(integrityMetadata.match(""), false);
});

test("if invalid value, return false", function () {
  const integrityMetadata = new IntegrityMetadataSet("md5\0/..invalid-value");

  assert.strictEqual(integrityMetadata.match("md5\0/..invalid-value"), false);
});
