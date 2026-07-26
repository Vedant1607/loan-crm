import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

function getKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 64) {
    throw new Error(
      "ENCRYPTION_KEY must be set as a 64-character hex string (32 bytes). Run: openssl rand -hex 32",
    );
  }
  return Buffer.from(key, "hex");
}

// Returns a single string: iv:authTag:ciphertext (all hex-encoded)
export function encrypt(plainText: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(12); // 12 bytes is standard for GCM

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(cipherText: string): string {
  const key = getKey();
  const [ivHex, authTagHex, encryptedHex] = cipherText.split(":");

  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error("Invalid encrypted string format");
  }

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

// Masks a PAN for display without decrypting: ABCDE1234F -> ABCXX1234F stays hidden -> shows only pattern
export function maskPan(pan: string): string {
  if (pan.length !== 10) return "XXXXXXXXXX";
  return `${pan.slice(0, 3)}XX${pan.slice(5, 9)}X`;
}
