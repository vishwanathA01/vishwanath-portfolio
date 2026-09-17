// Edge-compatible session signing. Do NOT import Node's `crypto` module here
// because middleware runs in the Edge runtime.
export const COOKIE_NAME = "vt_admin_session";

function secret() {
  return process.env.ADMIN_SECRET || "change-this-admin-secret-in-production";
}

function bytes(value: string) {
  return new TextEncoder().encode(value);
}

async function hmac(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    bytes(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, bytes(value));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function sign(value: string) {
  return hmac(value);
}

export async function makeSession(email: string) {
  return `${email}.${await sign(email)}`;
}

export async function verifySession(value?: string) {
  if (!value) return false;
  const i = value.lastIndexOf(".");
  if (i < 1) return false;

  const email = value.slice(0, i);
  const signature = value.slice(i + 1);
  if (!signature) return false;

  const expected = await sign(email);
  if (signature.length !== expected.length) return false;

  // Constant-time-ish comparison without Node Buffer/timingSafeEqual.
  let diff = 0;
  for (let n = 0; n < expected.length; n++) {
    diff |= expected.charCodeAt(n) ^ signature.charCodeAt(n);
  }
  return diff === 0;
}
