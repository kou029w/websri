import assert from "node:assert/strict";
import { test } from "node:test";
import { IntegrityMetadata } from "../../dist/index.js";

test("if the hash values match, return true", function () {
  const integrityMetadata = new IntegrityMetadata(
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

test("if the hash algorithms are different, return false", function () {
  const integrityMetadata = new IntegrityMetadata(
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
  const integrityMetadata = new IntegrityMetadata(
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
  const integrityMetadata = new IntegrityMetadata(
    "sha1-lDpwLQbzRZmu4fjajvn3KWAx1pk=",
  );

  assert.strictEqual(
    integrityMetadata.match(
      new IntegrityMetadata("sha1-lDpwLQbzRZmu4fjajvn3KWAx1pk="),
    ),
    false,
  );
});

test("if null, return false", function () {
  const integrityMetadata = new IntegrityMetadata(null);

  assert.strictEqual(
    integrityMetadata.match(new IntegrityMetadata(null)),
    false,
  );
});

test("if empty, return false", function () {
  const integrityMetadata = new IntegrityMetadata("");

  assert.strictEqual(integrityMetadata.match(new IntegrityMetadata("")), false);
});

test("if invalid value, return false", function () {
  const integrityMetadata = new IntegrityMetadata("md5\0/..invalid-value");

  assert.strictEqual(
    integrityMetadata.match(new IntegrityMetadata("md5\0/..invalid-value")),
    false,
  );
});
