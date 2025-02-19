import assert from "node:assert";
import { test } from "node:test";
import { IntegrityMetadataSet } from "../../src/index.ts";

test("pick the strongest metadata from set", function () {
  const integrityMetadataSet = new IntegrityMetadataSet(`
sha256-gxZXfeA3KCK+ZyBybEt6liVPg+FWGf/KLVU6rufBujE=
sha384-LDW1hUX1OX+VZsNmW+LELiky69a4xF+FfVsTlqZOhqPiPj5YYo20jP6C8H8uXMZf
sha512-aqnrVqlE3w/CWs51jb3FHCsFSBwfpecdXHaFFYZNkxfW2Z1qyJm4mA9iCPK11KeWwEa8rbMDq7l6IrnevQuOQw==
sha512-P8q/bH6NoZs5MnZKL9D/r/oEZOlyEAmSfuXuJchD2WeXnKbnfcO3fF0WvO6CiqZUGWsEREs9BWLrv1xr3NPOLg==
`);

  assert.deepEqual(
    [...integrityMetadataSet.strongest],
    [
      {
        alg: "sha512",
        val: "aqnrVqlE3w/CWs51jb3FHCsFSBwfpecdXHaFFYZNkxfW2Z1qyJm4mA9iCPK11KeWwEa8rbMDq7l6IrnevQuOQw==",
        opt: [],
      },
      {
        alg: "sha512",
        val: "P8q/bH6NoZs5MnZKL9D/r/oEZOlyEAmSfuXuJchD2WeXnKbnfcO3fF0WvO6CiqZUGWsEREs9BWLrv1xr3NPOLg==",
        opt: [],
      },
    ],
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
