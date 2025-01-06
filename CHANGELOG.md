# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Change `strongest` property type from `Array<IntegrityMetadata>` to `IntegrityMetadataSet`
- Improve documentation

## [0.1.0] - 2024-10-02

- **IntegrityMetadataSet Enhancements**: Refactored `IntegrityMetadataSet` to improve structure and flexibility, including new methods (`match`, `strongestHashAlgorithms`, `iterator`, and `size`), support for more flexible input types, and enhanced validation logic.
- **Type Definitions & Code Readability**: Improved type definitions and enhanced overall code readability.
- **Build & Tooling**: Replaced `tsup` with `pkgroll` and `tsx` for bundling.

## [0.0.3] - 2024-09-03

- Rename `SubresourceIntegrity` to `IntegrityMetadataSet`

## [0.0.2] - 2024-09-02

- Add `types` field in package.json

## [0.0.1] - 2024-09-02

- First release

[0.1.0]: https://github.com/kou029w/websri/compare/v0.0.3...v0.1.0
[0.0.3]: https://github.com/kou029w/websri/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/kou029w/websri/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/kou029w/usri/releases/tag/v0.0.1
[unreleased]: https://github.com/kou029w/websri/compare/v0.1.0...HEAD
