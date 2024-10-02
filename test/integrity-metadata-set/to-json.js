import assert from "node:assert/strict";
import { test } from "node:test";
import { IntegrityMetadataSet } from "../../dist/index.js";

test("toJSON() can be used", function () {
  const integrityMetadataSet = new IntegrityMetadataSet(
    `
sha384-VbxVaw0v4Pzlgrpf4Huq//A1ZTY4x6wNVJTCpkwL6hzFczHHwSpFzbyn9MNKCJ7r
sha512-wVJ82JPBJHc9gRkRlwyP5uhX1t9dySJr2KFgYUwM2WOk3eorlLt9NgIe+dhl1c6ilKgt1JoLsmn1H256V/eUIQ==
`,
  );

  assert.strictEqual(
    integrityMetadataSet.toJSON(),
    "sha384-VbxVaw0v4Pzlgrpf4Huq//A1ZTY4x6wNVJTCpkwL6hzFczHHwSpFzbyn9MNKCJ7r sha512-wVJ82JPBJHc9gRkRlwyP5uhX1t9dySJr2KFgYUwM2WOk3eorlLt9NgIe+dhl1c6ilKgt1JoLsmn1H256V/eUIQ==",
  );
});
