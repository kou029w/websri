# websri

[![NPM Version](https://img.shields.io/npm/v/websri)](https://www.npmjs.com/package/websri) [![jsDocs.io](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/websri)

`websri` is a universal Subresource Integrity (SRI) utility for Node.js, browsers, Cloudflare Workers, Deno, Bun, and other web-compatible runtimes.

## Usage

Install package:

```sh
# npm
npm install websri

# yarn
yarn add websri

# pnpm
pnpm install websri

# bun
bun install websri
```

[Integrity Metadata](https://www.w3.org/TR/SRI/#integrity-metadata):

```ts
import { createIntegrityMetadata } from "websri";

const res = new Response("Hello, world!");
const data = await res.arrayBuffer();
const integrityMetadata = await createIntegrityMetadata("sha256", data);

console.log(integrityMetadata.toString());
// sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=
```

## Documentation

[API Reference](https://www.jsdocs.io/package/websri)

## FAQ

### What is Subresource Integrity?

[Subresource Integrity (SRI)](https://www.w3.org/TR/SRI/) is a security feature that allows user agents to verify that a fetched resource has not been manipulated unexpectedly.

## License

`websri` is released under the MIT License.
