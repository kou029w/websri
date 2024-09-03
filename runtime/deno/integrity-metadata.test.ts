import { assertEquals } from "@std/assert";
import { createIntegrityMetadata } from "../../src/index.ts";

Deno.test("createIntegrityMetadata()", async () => {
  const res = new Response("Hello, world!");
  const data = await res.arrayBuffer();
  const integrityMetadata = await createIntegrityMetadata("sha256", data);

  assertEquals(
    integrityMetadata.toString(),
    "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
  );
});
