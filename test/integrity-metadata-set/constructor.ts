import assert from "node:assert";
import { test } from "node:test";
import { IntegrityMetadataSet } from "../../src/index.ts";

test("supports SHA-256", function () {
  const set = new IntegrityMetadataSet(
    "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
  );

  assert.deepEqual(
    [...set],
    [
      {
        alg: "sha256",
        val: "MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
        opt: [],
      },
    ],
  );
});

test("supports SHA-384", function () {
  const set = new IntegrityMetadataSet(
    "sha384-VbxVaw0v4Pzlgrpf4Huq//A1ZTY4x6wNVJTCpkwL6hzFczHHwSpFzbyn9MNKCJ7r",
  );

  assert.deepEqual(
    [...set],
    [
      {
        alg: "sha384",
        val: "VbxVaw0v4Pzlgrpf4Huq//A1ZTY4x6wNVJTCpkwL6hzFczHHwSpFzbyn9MNKCJ7r",
        opt: [],
      },
    ],
  );
});

test("supports SHA-512", function () {
  const set = new IntegrityMetadataSet(
    "sha512-wVJ82JPBJHc9gRkRlwyP5uhX1t9dySJr2KFgYUwM2WOk3eorlLt9NgIe+dhl1c6ilKgt1JoLsmn1H256V/eUIQ==",
  );

  assert.deepEqual(
    [...set],
    [
      {
        alg: "sha512",
        val: "wVJ82JPBJHc9gRkRlwyP5uhX1t9dySJr2KFgYUwM2WOk3eorlLt9NgIe+dhl1c6ilKgt1JoLsmn1H256V/eUIQ==",
        opt: [],
      },
    ],
  );
});

test("accepts options", function () {
  const set = new IntegrityMetadataSet(
    "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=?foo?bar",
  );

  assert.deepEqual(
    [...set],
    [
      {
        alg: "sha256",
        val: "MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
        opt: ["foo", "bar"],
      },
    ],
  );
});

test("accepts an IntegrityMetadata like object as input", function () {
  const set = new IntegrityMetadataSet({
    alg: "sha256",
    val: "MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
  });

  assert.deepEqual(
    set,
    new IntegrityMetadataSet(
      "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
    ),
  );
});

test("multiple algorithms can be accepted", function () {
  const set = new IntegrityMetadataSet([
    {
      alg: "sha256",
      val: "MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
    },
    `
sha384-VbxVaw0v4Pzlgrpf4Huq//A1ZTY4x6wNVJTCpkwL6hzFczHHwSpFzbyn9MNKCJ7r
sha512-wVJ82JPBJHc9gRkRlwyP5uhX1t9dySJr2KFgYUwM2WOk3eorlLt9NgIe+dhl1c6ilKgt1JoLsmn1H256V/eUIQ==
`,
  ]);

  assert.deepEqual(
    set,
    new IntegrityMetadataSet([
      "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
      "sha384-VbxVaw0v4Pzlgrpf4Huq//A1ZTY4x6wNVJTCpkwL6hzFczHHwSpFzbyn9MNKCJ7r",
      "sha512-wVJ82JPBJHc9gRkRlwyP5uhX1t9dySJr2KFgYUwM2WOk3eorlLt9NgIe+dhl1c6ilKgt1JoLsmn1H256V/eUIQ==",
    ]),
  );
});

test("multiple overlapping algorithms can be accepted", function () {
  const set = new IntegrityMetadataSet([
    "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
    "sha256-uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek=",
  ]);

  assert.deepEqual(
    set,
    new IntegrityMetadataSet([
      "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
      "sha256-uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek=",
    ]),
  );
});

test("trims leading and trailing whitespace", function () {
  const set = new IntegrityMetadataSet(
    "\t  sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=\u0020\u00a0\u1680\u2000\u2001\u2002\u3000",
  );

  assert.deepEqual(
    set,
    new IntegrityMetadataSet(
      "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
    ),
  );
});

test("whitespace can be analyzed as entry separator", function () {
  const set = new IntegrityMetadataSet(
    "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=\t\u0020\u00a0\u1680sha384-VbxVaw0v4Pzlgrpf4Huq//A1ZTY4x6wNVJTCpkwL6hzFczHHwSpFzbyn9MNKCJ7r\u2000\u2001\u2002\u3000sha512-wVJ82JPBJHc9gRkRlwyP5uhX1t9dySJr2KFgYUwM2WOk3eorlLt9NgIe+dhl1c6ilKgt1JoLsmn1H256V/eUIQ==",
  );

  assert.deepEqual(
    set,
    new IntegrityMetadataSet([
      "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
      "sha384-VbxVaw0v4Pzlgrpf4Huq//A1ZTY4x6wNVJTCpkwL6hzFczHHwSpFzbyn9MNKCJ7r",
      "sha512-wVJ82JPBJHc9gRkRlwyP5uhX1t9dySJr2KFgYUwM2WOk3eorlLt9NgIe+dhl1c6ilKgt1JoLsmn1H256V/eUIQ==",
    ]),
  );
});

test("discards unsupported hash algorithm", function () {
  const set = new IntegrityMetadataSet("sha1-lDpwLQbzRZmu4fjajvn3KWAx1pk=");

  assert.deepEqual(set, new IntegrityMetadataSet([]));
});

test("discards null input", function () {
  const set = new IntegrityMetadataSet(null);

  assert.deepEqual(set, new IntegrityMetadataSet([]));
});

test("discards empty string input", function () {
  const set = new IntegrityMetadataSet([]);

  assert.deepEqual(set, new IntegrityMetadataSet([]));
});

test("discards invalid value", function () {
  const set = new IntegrityMetadataSet("md5\0/..invalid-value");

  assert.deepEqual(set, new IntegrityMetadataSet([]));
});

test("discards invalid values in a list of multiple inputs", function () {
  const set = new IntegrityMetadataSet(
    "sha1-lDpwLQbzRZmu4fjajvn3KWAx1pk= md5\0/..invalid-value",
  );

  assert.deepEqual(set, new IntegrityMetadataSet([]));
});
