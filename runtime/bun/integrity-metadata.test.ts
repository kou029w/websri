import { expect, test } from "bun:test";
import { createIntegrityMetadata } from "../../src/index.ts";

test("createIntegrityMetadata()", async () => {
  const res = new Response("Hello, world!");
  const data = await res.arrayBuffer();
  const integrityMetadata = await createIntegrityMetadata("sha256", data);

  expect(integrityMetadata.toString()).toBe(
    "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
  );
});
