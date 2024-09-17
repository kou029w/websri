/** Content Security Policy Level 2, section 4.2 */
export type HashAlgorithm = "sha256" | "sha384" | "sha512";

/** Supported Hash Algorithms */
export const supportedHashAlgorithms = {
  sha256: "SHA-256",
  sha384: "SHA-384",
  sha512: "SHA-512",
} as const satisfies Record<HashAlgorithm, HashAlgorithmIdentifier>;

export type PrioritizedHashAlgorithm = "" | HashAlgorithm;

/** [W3C Subresource Integrity getPrioritizedHashFunction(a, b)](https://www.w3.org/TR/SRI/#dfn-getprioritizedhashfunction-a-b) */
export type GetPrioritizedHashAlgorithm = (
  a: HashAlgorithm,
  b: HashAlgorithm,
) => PrioritizedHashAlgorithm;

/** [W3C Subresource Integrity getPrioritizedHashFunction(a, b)](https://www.w3.org/TR/SRI/#dfn-getprioritizedhashfunction-a-b) */
export function getPrioritizedHashAlgorithm(
  a: HashAlgorithm,
  b: HashAlgorithm,
): PrioritizedHashAlgorithm {
  if (a === b) return "";
  if (!(a in supportedHashAlgorithms)) return "";
  if (!(b in supportedHashAlgorithms)) return "";
  return a < b ? b : a;
}

export const IntegrityMetadataRegex =
  /^(?<alg>sha256|sha384|sha512)-(?<val>(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)(?:[?](?<opts>[\x21-\x7e]*))?$/;

export const SeparatorRegex = /[^\x21-\x7e]+/;

/** Integrity Metadata Like */
export type IntegrityMetadataLike = {
  alg: PrioritizedHashAlgorithm;
  val: string;
  opt?: string[];
};

/** Integrity Metadata */
export class IntegrityMetadata implements IntegrityMetadataLike {
  alg: PrioritizedHashAlgorithm;
  val: string;
  opt: string[];

  constructor(integrity: string) {
    const {
      alg = "",
      val = "",
      opt,
    } = IntegrityMetadataRegex.exec(integrity)?.groups ?? {};

    Object.assign(this, {
      alg,
      val,
      opt: opt?.split("?") ?? [],
    });
  }

  match({ alg, val }: IntegrityMetadataLike): boolean {
    return alg === this.alg && val === this.val;
  }

  toString(): string {
    return IntegrityMetadata.stringify(this);
  }

  toJSON(): string {
    return this.toString();
  }

  static stringify({ alg, val, opt = [] }: IntegrityMetadataLike): string {
    if (!alg) return "";
    if (!val) return "";
    if (!(alg in supportedHashAlgorithms)) return "";
    return `${alg}-${[val, ...opt].join("?")}`;
  }
}

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

/** Integrity Metadata Set Options */
export type IntegrityMetadataSetOptions = {
  getPrioritizedHashAlgorithm: GetPrioritizedHashAlgorithm;
};

/** Integrity Metadata Set */
export class IntegrityMetadataSet extends Map<
  HashAlgorithm,
  IntegrityMetadata
> {
  getPrioritizedHashAlgorithm: GetPrioritizedHashAlgorithm;

  constructor(
    integrity: string,
    options: IntegrityMetadataSetOptions = {
      getPrioritizedHashAlgorithm,
    },
  ) {
    super();

    const integrityMetadata = integrity.split(SeparatorRegex);

    for (const integrity of integrityMetadata.filter(Boolean)) {
      const integrityMetadata = new IntegrityMetadata(integrity);

      if (integrityMetadata.alg) {
        this.set(integrityMetadata.alg, integrityMetadata);
      }
    }

    this.getPrioritizedHashAlgorithm = options.getPrioritizedHashAlgorithm;
  }

  /** [W3C Subresource Integrity 3.3.4 Get the strongest metadata from set.](https://www.w3.org/TR/SRI/#get-the-strongest-metadata-from-set) */
  get strongest(): IntegrityMetadata {
    const [hashAlgorithm = "sha512"]: ReadonlyArray<HashAlgorithm> = [
      ...this.keys(),
    ].sort((a, b) => {
      switch (this.getPrioritizedHashAlgorithm(a, b)) {
        default:
        case "":
          return 0;
        case a:
          return -1;
        case b:
          return +1;
      }
    });

    return this.get(hashAlgorithm) ?? new IntegrityMetadata("");
  }

  join(separator = " ") {
    return [...this.values()].map(String).join(separator);
  }

  toString(): string {
    return this.join();
  }

  toJSON(): string {
    return this.toString();
  }
}

export async function createIntegrityMetadataSet(
  hashAlgorithms: HashAlgorithm[],
  data: ArrayBuffer,
  options: IntegrityMetadataSetOptions = {
    getPrioritizedHashAlgorithm,
  },
): Promise<IntegrityMetadataSet> {
  const integrityMetadata = await Promise.all(
    hashAlgorithms.map((alg) => createIntegrityMetadata(alg, data)),
  );

  return new IntegrityMetadataSet(integrityMetadata.join(" "), options);
}
