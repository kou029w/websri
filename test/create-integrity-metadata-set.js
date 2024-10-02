import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createIntegrityMetadataSet,
  IntegrityMetadata,
  IntegrityMetadataSet,
} from "../dist/index.js";

test("instantiate a new IntegrityMetadataSet", async function () {
  const res = new Response("Hello, world!");
  const data = await res.arrayBuffer();
  const set = await createIntegrityMetadataSet("sha256", data);

  assert(set instanceof IntegrityMetadataSet);
});

test("instantiate with the specified hash algorithms and ArrayBuffer", async function () {
  const res = new Response("Hello, world!");
  const data = await res.arrayBuffer();
  const set = await createIntegrityMetadataSet(["sha384", "sha512"], data);

  assert.deepEqual(
    [...set],
    [
      new IntegrityMetadata({
        alg: "sha384",
        val: "VbxVaw0v4Pzlgrpf4Huq//A1ZTY4x6wNVJTCpkwL6hzFczHHwSpFzbyn9MNKCJ7r",
      }),
      new IntegrityMetadata({
        alg: "sha512",
        val: "wVJ82JPBJHc9gRkRlwyP5uhX1t9dySJr2KFgYUwM2WOk3eorlLt9NgIe+dhl1c6ilKgt1JoLsmn1H256V/eUIQ==",
      }),
    ],
  );
});
