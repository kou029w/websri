import assert from "node:assert";
import { test } from "node:test";
import { IntegrityMetadata } from "../../dist/index.js";

test("supports SHA-256", function () {
  const integrityMetadata = new IntegrityMetadata(
    "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
  );

  assert.deepEqual(integrityMetadata, {
    alg: "sha256",
    val: "MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
    opt: [],
  });
});

test("supports SHA-384", function () {
  const integrityMetadata = new IntegrityMetadata(
    "sha384-VbxVaw0v4Pzlgrpf4Huq//A1ZTY4x6wNVJTCpkwL6hzFczHHwSpFzbyn9MNKCJ7r",
  );

  assert.deepEqual(integrityMetadata, {
    alg: "sha384",
    val: "VbxVaw0v4Pzlgrpf4Huq//A1ZTY4x6wNVJTCpkwL6hzFczHHwSpFzbyn9MNKCJ7r",
    opt: [],
  });
});

test("supports SHA-512", function () {
  const integrityMetadata = new IntegrityMetadata(
    "sha512-wVJ82JPBJHc9gRkRlwyP5uhX1t9dySJr2KFgYUwM2WOk3eorlLt9NgIe+dhl1c6ilKgt1JoLsmn1H256V/eUIQ==",
  );

  assert.deepEqual(integrityMetadata, {
    alg: "sha512",
    val: "wVJ82JPBJHc9gRkRlwyP5uhX1t9dySJr2KFgYUwM2WOk3eorlLt9NgIe+dhl1c6ilKgt1JoLsmn1H256V/eUIQ==",
    opt: [],
  });
});

test("accepts options", function () {
  const integrityMetadata = new IntegrityMetadata(
    "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=?foo?bar",
  );

  assert.deepEqual(integrityMetadata, {
    alg: "sha256",
    val: "MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
    opt: ["foo", "bar"],
  });
});

test.todo("accepts an IntegrityMetadata like object as input", function () {
  const integrityMetadata = new IntegrityMetadata({
    alg: "sha256",
    val: "MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
  });

  assert.deepEqual(
    integrityMetadata,
    new IntegrityMetadata(
      "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
    ),
  );
});

test("trims leading and trailing whitespace", function () {
  const integrityMetadata = new IntegrityMetadata(
    "\t  sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=\u0020\u00a0\u1680\u2000\u2001\u2002\u3000",
  );

  assert.deepEqual(
    integrityMetadata,
    new IntegrityMetadata(
      "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
    ),
  );
});

test("discards unsupported hash algorithm", function () {
  const integrityMetadata = new IntegrityMetadata(
    "sha1-lDpwLQbzRZmu4fjajvn3KWAx1pk=",
  );

  assert.deepEqual(integrityMetadata, new IntegrityMetadata());
});

test("discards null input", function () {
  const integrityMetadata = new IntegrityMetadata(null);

  assert.deepEqual(integrityMetadata, new IntegrityMetadata());
});

test("discards empty string input", function () {
  const integrityMetadata = new IntegrityMetadata("");

  assert.deepEqual(integrityMetadata, new IntegrityMetadata());
});

test("discards invalid value", function () {
  const integrityMetadata = new IntegrityMetadata("md5\0/..invalid-value");

  assert.deepEqual(integrityMetadata, new IntegrityMetadata());
});

test("discards invalid values in a list of multiple inputs", function () {
  const integrityMetadata = new IntegrityMetadata(
    "sha1-lDpwLQbzRZmu4fjajvn3KWAx1pk= md5\0/..invalid-value",
  );

  assert.deepEqual(integrityMetadata, new IntegrityMetadata());
});
