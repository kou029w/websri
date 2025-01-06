/**
 * Represents the available hash algorithms used for Subresource Integrity.
 * @see {@link https://www.w3.org/TR/CSP2/#hash_algo}
 */
export type HashAlgorithm = "sha256" | "sha384" | "sha512";

/**
 * A constant object defining the supported hash algorithms and their corresponding string
 * representations for cryptographic operations. These algorithms are referenced by name when
 * working with hashing functions in Web Crypto APIs.
 */
export const supportedHashAlgorithms = {
  /** SHA-256 hash algorithm */
  sha256: "SHA-256",
  /** SHA-384 hash algorithm */
  sha384: "SHA-384",
  /** SHA-512 hash algorithm */
  sha512: "SHA-512",
} as const satisfies Record<HashAlgorithm, HashAlgorithmIdentifier>;

/**
 * A union type representing either an empty string or a valid hash algorithm.
 * The empty string is used when no hash algorithm is selected or is considered equal.
 */
export type PrioritizedHashAlgorithm = "" | HashAlgorithm;

/**
 * Function to prioritize two hash algorithms, returning the stronger or an empty string if both
 * are unsupported or equal.
 * @see {@link https://www.w3.org/TR/SRI/#dfn-getprioritizedhashfunction-a-b}
 * @param a The first hash algorithm to compare.
 * @param b The second hash algorithm to compare.
 * @returns The hash algorithm or an empty string if both algorithms are unsupported or equal.
 */
export type GetPrioritizedHashAlgorithm = (
  a: HashAlgorithm,
  b: HashAlgorithm,
) => PrioritizedHashAlgorithm;

/**
 * Function to prioritize two hash algorithms, returning the stronger or an empty string if both
 * are unsupported or equal.
 * @see {@link https://www.w3.org/TR/SRI/#dfn-getprioritizedhashfunction-a-b}
 * @param a The first hash algorithm to compare.
 * @param b The second hash algorithm to compare.
 * @returns The hash algorithm or an empty string if both algorithms are unsupported or equal.
 */
export function getPrioritizedHashAlgorithm(
  a: HashAlgorithm,
  b: HashAlgorithm,
): PrioritizedHashAlgorithm {
  if (a === b) return "";

  if (!(a in supportedHashAlgorithms)) {
    return b in supportedHashAlgorithms ? b : "";
  }

  if (!(b in supportedHashAlgorithms)) {
    return a in supportedHashAlgorithms ? a : "";
  }

  return a < b ? b : a;
}

/**
 * Regular expression for matching integrity metadata format.
 */
export const IntegrityMetadataRegex =
  /^(?<alg>sha256|sha384|sha512)-(?<val>(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)(?:[?](?<opt>[\x21-\x7e]*))?$/;

/**
 * Regular expression for separating integrity metadata.
 */
export const SeparatorRegex = /[^\x21-\x7e]+/;

/**
 * Represents the structure of integrity metadata used for validating resources with Subresource
 * Integrity.
 */
export type IntegrityMetadataLike = {
  /** Hash algorithm */
  alg: PrioritizedHashAlgorithm;
  /** The base64-encoded hash value of the resource */
  val: string;
  /** Optional additional attributes */
  opt?: string[];
};

/**
 * Class representing integrity metadata, consisting of a hash algorithm and hash value.
 */
export class IntegrityMetadata implements IntegrityMetadataLike {
  /** Hash algorithm */
  alg: PrioritizedHashAlgorithm;
  /** The base64-encoded hash value of the resource */
  val: string;
  /** Optional additional attributes */
  opt: string[];

  /**
   * Creates an instance of `IntegrityMetadata` from a given object or string.
   * @param integrity The integrity metadata input, which can be a string or object.
   * @example
   * ```js
   * new IntegrityMetadata("sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=")
   * ```
   *
   * or
   *
   * ```js
   * new IntegrityMetadata({
   *   alg: "sha256",
   *   val: "MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
   * })
   * ```
   */
  constructor(integrity: IntegrityMetadataLike | string | null | undefined) {
    const integrityString =
      typeof integrity === "object" && integrity !== null
        ? IntegrityMetadata.stringify(integrity)
        : String(integrity ?? "").trim();

    const {
      alg = "",
      val = "",
      opt,
    } = IntegrityMetadataRegex.exec(integrityString)?.groups ?? {};

    Object.assign(this, {
      alg,
      val,
      opt: opt?.split("?") ?? [],
    });
  }

  /**
   * Compares the current integrity metadata with another object or string.
   * @param integrity The integrity metadata to compare with.
   * @returns `true` if the integrity metadata matches, `false` otherwise.
   * @example
   * ```js
   * integrityMetadata.match("sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=")
   * ```
   *
   * or
   *
   * ```js
   * integrityMetadata.match({
   *   alg: "sha256",
   *   val: "MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
   * })
   * ```
   */
  match(integrity: IntegrityMetadataLike | string | null | undefined): boolean {
    const { alg, val } = new IntegrityMetadata(integrity);
    if (!alg) return false;
    if (!val) return false;
    if (!(alg in supportedHashAlgorithms)) return false;
    return alg === this.alg && val === this.val;
  }

  /**
   * Converts the integrity metadata into a string representation.
   * @returns The string representation of the integrity metadata.
   */
  toString(): string {
    return IntegrityMetadata.stringify(this);
  }

  /**
   * Converts the integrity metadata into a JSON string.
   * @returns The JSON string representation of the integrity metadata.
   */
  toJSON(): string {
    return this.toString();
  }

  /**
   * Static method to stringify an integrity metadata object.
   * @param integrity The integrity metadata object to stringify.
   * @returns The stringified integrity metadata.
   * @example
   * ```js
   * IntegrityMetadata.stringify({
   *   alg: "sha256",
   *   val: "MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
   * }) // "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM="
   * ```
   */
  static stringify({ alg, val, opt = [] }: IntegrityMetadataLike): string {
    if (!alg) return "";
    if (!val) return "";
    if (!(alg in supportedHashAlgorithms)) return "";
    return `${alg}-${[val, ...opt].join("?")}`;
  }
}

/**
 * Asynchronously creates an `IntegrityMetadata` object from a hash algorithm and data.
 * @param hashAlgorithm The hash algorithm to use (e.g., `sha256`).
 * @param data The data to hash (in `ArrayBuffer` format).
 * @param opt Optional additional attributes.
 * @returns A promise that resolves to an `IntegrityMetadata` object.
 * @example
 * ```js
 * const res = new Response("Hello, world!");
 * const data = await res.arrayBuffer();
 * const integrityMetadata = await createIntegrityMetadata("sha256", data);
 * ```
 */
export async function createIntegrityMetadata(
  hashAlgorithm: HashAlgorithm,
  data: ArrayBuffer,
  opt: string[] = [],
): Promise<IntegrityMetadata> {
  const alg = hashAlgorithm.toLowerCase() as HashAlgorithm;

  if (!(alg in supportedHashAlgorithms)) {
    return new IntegrityMetadata("");
  }

  const hashAlgorithmIdentifier = supportedHashAlgorithms[alg];
  const arrayBuffer = await crypto.subtle.digest(hashAlgorithmIdentifier, data);
  const val = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
  const integrity = IntegrityMetadata.stringify({ alg, val, opt });

  return new IntegrityMetadata(integrity);
}

/**
 * Options for configuring an `IntegrityMetadataSet`.
 */
export type IntegrityMetadataSetOptions = {
  /** A custom function to determine the prioritized hash algorithm. */
  getPrioritizedHashAlgorithm?: GetPrioritizedHashAlgorithm;
};

/**
 * Class representing a set of integrity metadata, used for managing multiple hash algorithms and
 * their associated metadata.
 */
export class IntegrityMetadataSet {
  #set: ReadonlyArray<IntegrityMetadata>;

  /**
   * The strongest (most secure) integrity metadata from the set.
   * @see {@link https://www.w3.org/TR/SRI/#get-the-strongest-metadata-from-set}
   */
  readonly strongest: Array<IntegrityMetadata> = [];

  /**
   * Create an instance of `IntegrityMetadataSet` from integrity metadata or an array of integrity
   * metadata.
   * @param integrity The integrity metadata or an array of integrity metadata.
   * @param options Optional configuration options for hash algorithm prioritization.
   * @example
   * ```js
   * new IntegrityMetadataSet([
   *   "sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
   *   "sha384-VbxVaw0v4Pzlgrpf4Huq//A1ZTY4x6wNVJTCpkwL6hzFczHHwSpFzbyn9MNKCJ7r",
   *   "sha512-wVJ82JPBJHc9gRkRlwyP5uhX1t9dySJr2KFgYUwM2WOk3eorlLt9NgIe+dhl1c6ilKgt1JoLsmn1H256V/eUIQ==",
   * ])
   * ```
   *
   * or
   *
   * ```js
   * new IntegrityMetadataSet(`
   *   sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=
   *   sha384-VbxVaw0v4Pzlgrpf4Huq//A1ZTY4x6wNVJTCpkwL6hzFczHHwSpFzbyn9MNKCJ7r
   *   sha512-wVJ82JPBJHc9gRkRlwyP5uhX1t9dySJr2KFgYUwM2WOk3eorlLt9NgIe+dhl1c6ilKgt1JoLsmn1H256V/eUIQ==
   * `)
   * ```
   */
  constructor(
    integrity:
      | ReadonlyArray<IntegrityMetadataLike | string | null | undefined>
      | IntegrityMetadataLike
      | string
      | null
      | undefined,
    {
      getPrioritizedHashAlgorithm:
        _getPrioritizedHashAlgorithm = getPrioritizedHashAlgorithm,
    }: IntegrityMetadataSetOptions = {},
  ) {
    const set: ReadonlyArray<
      IntegrityMetadataLike | string | null | undefined
    > = [integrity]
      .flat()
      .flatMap(
        (
          integrity: IntegrityMetadataLike | string | null | undefined,
        ): ReadonlyArray<IntegrityMetadataLike | string | null | undefined> =>
          typeof integrity === "string"
            ? integrity.split(SeparatorRegex)
            : [integrity],
      );

    this.#set = set
      .map((integrity) => new IntegrityMetadata(integrity))
      .filter((integrityMetadata) => integrityMetadata.toString() !== "");

    for (const integrityMetadata of this.#set) {
      const [strongest = new IntegrityMetadata("")] = this.strongest;

      const prioritizedHashAlgorithm = _getPrioritizedHashAlgorithm(
        strongest.alg as HashAlgorithm,
        integrityMetadata.alg as HashAlgorithm,
      );

      switch (prioritizedHashAlgorithm) {
        case "":
          this.strongest.push(integrityMetadata);
          break;
        case integrityMetadata.alg:
          this.strongest = [integrityMetadata];
          break;
      }
    }
  }

  /**
   * Enables iteration over the set of integrity metadata.
   * @returns A generator that yields each IntegrityMetadata object.
   * @example
   * ```js
   * [...integrityMetadataSet]
   * ```
   */
  *[Symbol.iterator](): Generator<IntegrityMetadata> {
    for (const integrityMetadata of this.#set) {
      yield integrityMetadata;
    }
  }

  /**
   * The number of integrity metadata entries in the set.
   */
  get size(): number {
    return this.#set.length;
  }

  /**
   * Returns an array of the strongest supported hash algorithms in the set.
   */
  get strongestHashAlgorithms(): ReadonlyArray<HashAlgorithm> {
    const strongestHashAlgorithms = this.strongest
      .map(({ alg }) => alg as HashAlgorithm)
      .filter(Boolean);

    return [...new Set(strongestHashAlgorithms)];
  }

  /**
   * Checks if a given integrity metadata object or string matches any in the set.
   * @param integrity The integrity metadata to match.
   * @returns `true` if the integrity metadata matches, `false` otherwise.
   * @example
   * ```js
   * integrityMetadataSet.match("sha256-MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=")
   * ```
   *
   * or
   *
   * ```js
   * integrityMetadataSet.match({
   *   alg: "sha256",
   *   val: "MV9b23bQeMQ7isAGTkoBZGErH853yGk0W/yUx1iU7dM=",
   * })
   * ```
   */
  match(integrity: IntegrityMetadataLike | string | null | undefined): boolean {
    return this.#set.some((integrityMetadata) =>
      integrityMetadata.match(integrity),
    );
  }

  /**
   * Joins the integrity metadata in the set into a single string, separated by the specified
   * separator.
   * @param separator The separator to use (default is a space).
   * @returns The joined string representation of the set.
   */
  join(separator = " "): string {
    return this.#set.map(String).join(separator);
  }

  /**
   * Converts the set of integrity metadata to a string representation.
   * @returns The string representation of the set.
   */
  toString(): string {
    return this.join();
  }

  /**
   * Converts the set of integrity metadata to a JSON string.
   * @returns The JSON string representation of the set.
   */
  toJSON(): string {
    return this.toString();
  }
}

/**
 * Asynchronously creates an `IntegrityMetadataSet` from a set of hash algorithms and data.
 * @param hashAlgorithms A single hash algorithm or an array of supported hash algorithms.
 * @param data The data to hash (in `ArrayBuffer` format).
 * @param options Optional configuration options for the metadata set.
 * @returns A promise that resolves to an `IntegrityMetadataSet` object.
 * @example
 * ```js
 * const res = new Response("Hello, world!");
 * const data = await res.arrayBuffer();
 * const set = await createIntegrityMetadataSet(["sha256", "sha384", "sha512"], data);
 * ```
 */
export async function createIntegrityMetadataSet(
  hashAlgorithms: ReadonlyArray<HashAlgorithm> | HashAlgorithm,
  data: ArrayBuffer,
  options: IntegrityMetadataSetOptions = {
    getPrioritizedHashAlgorithm,
  },
): Promise<IntegrityMetadataSet> {
  const set = await Promise.all(
    [hashAlgorithms].flat().map((alg) => createIntegrityMetadata(alg, data)),
  );

  return new IntegrityMetadataSet(set, options);
}
