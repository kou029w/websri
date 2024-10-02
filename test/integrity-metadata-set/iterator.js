import assert from "node:assert";
import { test } from "node:test";
import { IntegrityMetadata, IntegrityMetadataSet } from "../../dist/index.js";

test("correctly iterate over the set", function () {
  const integrityMetadataSet = new IntegrityMetadataSet(`
sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=
sha384-VbxVaw0v4Pzlgrpf4Huq//A1ZTY4x6wNVJTCpkwL6hzFczHHwSpFzbyn9MNKCJ7r
sha512-wVJ82JPBJHc9gRkRlwyP5uhX1t9dySJr2KFgYUwM2WOk3eorlLt9NgIe+dhl1c6ilKgt1JoLsmn1H256V/eUIQ==
`);

  assert.deepEqual(
    [...integrityMetadataSet],
    [
      new IntegrityMetadata(
        "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
      ),
      new IntegrityMetadata(
        "sha384-VbxVaw0v4Pzlgrpf4Huq//A1ZTY4x6wNVJTCpkwL6hzFczHHwSpFzbyn9MNKCJ7r",
      ),
      new IntegrityMetadata(
        "sha512-wVJ82JPBJHc9gRkRlwyP5uhX1t9dySJr2KFgYUwM2WOk3eorlLt9NgIe+dhl1c6ilKgt1JoLsmn1H256V/eUIQ==",
      ),
    ],
  );
});

test("if the empty set, return the empty set", function () {
  const integrityMetadataSet = new IntegrityMetadataSet();

  assert.deepEqual([...integrityMetadataSet], []);
});
