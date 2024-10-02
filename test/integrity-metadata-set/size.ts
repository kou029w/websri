import assert from "node:assert/strict";
import { test } from "node:test";
import { IntegrityMetadataSet } from "../../src/index.ts";

test("return the correct size of the set", function () {
  const integrityMetadataSet = new IntegrityMetadataSet(`
sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=
sha384-VbxVaw0v4Pzlgrpf4Huq//A1ZTY4x6wNVJTCpkwL6hzFczHHwSpFzbyn9MNKCJ7r
sha512-wVJ82JPBJHc9gRkRlwyP5uhX1t9dySJr2KFgYUwM2WOk3eorlLt9NgIe+dhl1c6ilKgt1JoLsmn1H256V/eUIQ==
`);

  assert.strictEqual(integrityMetadataSet.size, 3);
});

test("if the empty set, return 0", function () {
  const integrityMetadataSet = new IntegrityMetadataSet([]);

  assert.strictEqual(integrityMetadataSet.size, 0);
});
