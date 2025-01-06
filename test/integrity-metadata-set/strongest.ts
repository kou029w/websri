import assert from "node:assert";
import { test } from "node:test";
import { IntegrityMetadataSet } from "../../src/index.ts";

test("pick the strongest metadata from set", function () {
  const integrityMetadataSet = new IntegrityMetadataSet(`
sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=
sha384-VbxVaw0v4Pzlgrpf4Huq//A1ZTY4x6wNVJTCpkwL6hzFczHHwSpFzbyn9MNKCJ7r
sha512-wVJ82JPBJHc9gRkRlwyP5uhX1t9dySJr2KFgYUwM2WOk3eorlLt9NgIe+dhl1c6ilKgt1JoLsmn1H256V/eUIQ==
`);

  assert.deepEqual(
    integrityMetadataSet.strongest,
    new IntegrityMetadataSet(
      "sha512-wVJ82JPBJHc9gRkRlwyP5uhX1t9dySJr2KFgYUwM2WOk3eorlLt9NgIe+dhl1c6ilKgt1JoLsmn1H256V/eUIQ==",
    ),
  );
});

test("if there are no supported algorithms, return the empty set", function () {
  const integrityMetadataSet = new IntegrityMetadataSet(`
sha1-lDpwLQbzRZmu4fjajvn3KWAx1pk=
md5-bNNVbesNpUvKBgtMOUeYOQ==
`);

  assert.deepEqual(
    integrityMetadataSet.strongest,
    new IntegrityMetadataSet([]),
  );
});

test("custom getPrioritizedHashAlgorithm function can be used", function () {
  const integrityMetadataSet = new IntegrityMetadataSet(
    `
sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=
sha384-VbxVaw0v4Pzlgrpf4Huq//A1ZTY4x6wNVJTCpkwL6hzFczHHwSpFzbyn9MNKCJ7r
sha512-wVJ82JPBJHc9gRkRlwyP5uhX1t9dySJr2KFgYUwM2WOk3eorlLt9NgIe+dhl1c6ilKgt1JoLsmn1H256V/eUIQ==
`,
    {
      getPrioritizedHashAlgorithm() {
        return "sha384";
      },
    },
  );

  assert.deepEqual(
    integrityMetadataSet.strongest,
    new IntegrityMetadataSet(
      "sha384-VbxVaw0v4Pzlgrpf4Huq//A1ZTY4x6wNVJTCpkwL6hzFczHHwSpFzbyn9MNKCJ7r",
    ),
  );
});
