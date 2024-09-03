/** Content Security Policy Level 2, section 4.2 */
export type HashAlgorithm = "sha256" | "sha384" | "sha512";

export const supportedHashAlgorithm: ReadonlyArray<HashAlgorithm> = [
  "sha512",
  "sha384",
  "sha256",
];

export const supportedHashAlgorithmName = {
  sha256: "SHA-256",
  sha384: "SHA-384",
  sha512: "SHA-512",
} satisfies Record<HashAlgorithm, string>;

export type PrioritizedHash = "" | HashAlgorithm;

export function getPrioritizedHash(
  a: HashAlgorithm,
  b: HashAlgorithm,
): PrioritizedHash {
  if (a === b) return "";
  if (!supportedHashAlgorithm.includes(a)) return "";
  if (!supportedHashAlgorithm.includes(b)) return "";
  return a < b ? b : a;
}

export const IntegrityMetadataRegex =
  /^(?<alg>sha256|sha384|sha512)-(?<val>(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)(?:[?](?<opts>[\x21-\x7e]*))?$/;

export const SeparatorRegex = /[^\x21-\x7e]+/;

/** Integrity Metadata */
export class IntegrityMetadata {
  alg: PrioritizedHash;
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

  match(integrity: { alg: PrioritizedHash; val: string }): boolean {
    return integrity.alg === this.alg && integrity.val === this.val;
  }

  toString(): string {
    return IntegrityMetadata.stringify(this);
  }

  toJSON(): string {
    return this.toString();
  }

  static stringify(integrity: {
    alg: PrioritizedHash;
    val: string;
    opt: string[];
  }): string {
    if (!integrity.alg) return "";
    if (!integrity.val) return "";
    if (!supportedHashAlgorithm.includes(integrity.alg)) return "";
    return `${integrity.alg}-${[integrity.val, ...integrity.opt].join("?")}`;
  }
}

export async function createIntegrityMetadata(
  hashAlgorithm: HashAlgorithm,
  data: ArrayBuffer,
  opt: string[] = [],
): Promise<string> {
  const alg = hashAlgorithm.toLowerCase() as HashAlgorithm;

  if (!supportedHashAlgorithm.includes(alg)) return "";

  const arrayBuffer = await crypto.subtle.digest(
    supportedHashAlgorithmName[alg.toLowerCase()],
    data,
  );

  const val = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

  return IntegrityMetadata.stringify({
    alg,
    val,
    opt,
  });
}

/** Integrity Metadata Set */
export class IntegrityMetadataSet extends Map<
  HashAlgorithm,
  IntegrityMetadata
> {
  getPrioritizedHash: (a: HashAlgorithm, b: HashAlgorithm) => PrioritizedHash;

  constructor(integrity: string, options = { getPrioritizedHash }) {
    super();

    const integrityMetadata = integrity.split(SeparatorRegex);

    for (const integrity of integrityMetadata.filter(Boolean)) {
      const integrityMetadata = new IntegrityMetadata(integrity);

      if (integrityMetadata.alg) {
        this.set(integrityMetadata.alg, integrityMetadata);
      }
    }

    this.getPrioritizedHash = options.getPrioritizedHash;
  }

  get strongest(): IntegrityMetadata {
    const [hashAlgorithm = supportedHashAlgorithm[0]]: HashAlgorithm[] = [
      ...this.keys(),
    ].sort((a, b) => {
      switch (this.getPrioritizedHash(a, b)) {
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

  match(integrity: { alg: PrioritizedHash; val: string }): boolean {
    return this.strongest.match(integrity);
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
): Promise<IntegrityMetadataSet> {
  const integrityMetadata = await Promise.all(
    hashAlgorithms.map((alg) => createIntegrityMetadata(alg, data)),
  );

  return new IntegrityMetadataSet(integrityMetadata.join(" "));
}
