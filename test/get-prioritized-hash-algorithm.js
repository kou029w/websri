import assert from "node:assert/strict";
import { test } from "node:test";
import { getPrioritizedHashAlgorithm } from "../dist/index.js";

test("return the most collision-resistant hash algorithm", function () {
  assert.strictEqual(getPrioritizedHashAlgorithm("sha256", "sha512"), "sha512");
});

test("if the priority is equal, return the empty string", function () {
  assert.strictEqual(getPrioritizedHashAlgorithm("sha256", "sha256"), "");
});

test("if both hash algorithms are not supported, return the empty string", function () {
  assert.strictEqual(getPrioritizedHashAlgorithm("md5", "sha1"), "");
});

test("if one of the hash algorithms is unsupported, return the supported hash algorithm", function () {
  assert.strictEqual(getPrioritizedHashAlgorithm("md5", "sha256"), "sha256");
});

test("if both strings are empty, return the empty string", function () {
  assert.strictEqual(getPrioritizedHashAlgorithm("", ""), "");
});

test("if either is the empty string, it return the supported hash algorithm", function () {
  assert.strictEqual(getPrioritizedHashAlgorithm("sha256", ""), "sha256");
});
