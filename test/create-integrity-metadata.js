import assert from "node:assert";
import { test } from "node:test";
import { createIntegrityMetadata, IntegrityMetadata } from "../dist/index.js";

test("instantiate a new IntegrityMetadata", async function () {
  const res = new Response("Hello, world!");
  const data = await res.arrayBuffer();
  const integrityMetadata = await createIntegrityMetadata("sha256", data);

  assert(integrityMetadata instanceof IntegrityMetadata);
});

test("instantiate with the specified hash algorithm and ArrayBuffer", async function () {
  const res = new Response("Hello, world!");
  const data = await res.arrayBuffer();
  const integrityMetadata = await createIntegrityMetadata("sha256", data);

  assert.deepEqual(integrityMetadata, {
    alg: "sha256",
    val: "MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
    opt: [],
  });
});
