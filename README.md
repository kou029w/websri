# subresourceintegrity

[![NPM Version](https://img.shields.io/npm/v/subresourceintegrity)](https://www.npmjs.com/package/subresourceintegrity) [![jsDocs.io](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/subresourceintegrity)

`subresourceintegrity` is a utility designed for Subresource Integrity that works across various web-interoperable runtimes, including Node.js, browsers, Cloudflare Workers, Deno, Bun, and others.

## Usage

Install package:

```sh
# npm
npm install subresourceintegrity

# yarn
yarn add subresourceintegrity

# pnpm
pnpm install subresourceintegrity

# bun
bun install subresourceintegrity
```

[Integrity Metadata](https://www.w3.org/TR/SRI/#integrity-metadata):

```ts
import { createIntegrityMetadata } from "subresourceintegrity";

const res = new Response("Hello, world!");
const data = await res.arrayBuffer();
const integrityMetadata = await createIntegrityMetadata("sha256", data);

console.log(integrityMetadata.toString());
// sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=
```

## Documentation

[API Reference](https://www.jsdocs.io/package/subresourceintegrity)

## FAQ

### What is Subresource Integrity?

[Subresource Integrity (SRI)](https://www.w3.org/TR/SRI/) is a security feature that allows user agents to verify that a fetched resource has not been manipulated unexpectedly.

## License

`subresourceintegrity` is released under the MIT License.
