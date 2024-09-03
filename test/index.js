import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createIntegrityMetadata,
  createIntegrityMetadataSet,
  IntegrityMetadataSet,
} from "../dist/index.js";

test("createIntegrityMetadata()", async function () {
  const res = new Response("Hello, world!");
  const data = await res.arrayBuffer();
  const integrityMetadata = await createIntegrityMetadata("sha256", data);

  assert.strictEqual(
    integrityMetadata.toString(),
    "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
  );
});

test("createIntegrityMetadataSet()", async function () {
  const res = new Response("Hello, world!");
  const data = await res.arrayBuffer();
  const sri = await createIntegrityMetadataSet(["sha384", "sha512"], data);

  assert.strictEqual(
    sri.toString(),
    "sha384-VbxVaw0v4Pzlgrpf4Huq//A1ZTY4x6wNVJTCpkwL6hzFczHHwSpFzbyn9MNKCJ7r sha512-wVJ82JPBJHc9gRkRlwyP5uhX1t9dySJr2KFgYUwM2WOk3eorlLt9NgIe+dhl1c6ilKgt1JoLsmn1H256V/eUIQ==",
  );
});

test("IntegrityMetadataSet.strongest", async function () {
  const { strongest } = new IntegrityMetadataSet(`
sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=
sha384-VbxVaw0v4Pzlgrpf4Huq//A1ZTY4x6wNVJTCpkwL6hzFczHHwSpFzbyn9MNKCJ7r
sha512-wVJ82JPBJHc9gRkRlwyP5uhX1t9dySJr2KFgYUwM2WOk3eorlLt9NgIe+dhl1c6ilKgt1JoLsmn1H256V/eUIQ==
`);

  assert.strictEqual(strongest.alg, "sha512");
});
