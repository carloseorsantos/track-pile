import crypto from "crypto";

/**
 * Thin client for the AbacatePay API (https://docs.abacatepay.com).
 * No SDK dependency — just `fetch`, matching the rest of this project's
 * "no HTTP client wrapper" convention.
 *
 * Docs used while building this:
 * - POST /products/create      https://docs.abacatepay.com/pages/products/create
 * - POST /customers/create     https://docs.abacatepay.com/pages/client/create
 * - POST /subscriptions/create https://docs.abacatepay.com/pages/subscriptions/create
 * - Webhooks                   https://docs.abacatepay.com/pages/webhooks
 */

const BASE_URL = process.env.ABACATEPAY_BASE_URL ?? "https://api.abacatepay.com/v2";

const PRO_PRODUCT_EXTERNAL_ID = "trackpile-pro";
const PRO_PRICE_CENTS = 1900; // R$19,00/mês

type AbacateEnvelope<T> = {
  data: T | null;
  error: string | null;
  success: boolean;
};

async function abacateFetch<T>(path: string, body?: unknown, method: "GET" | "POST" = "POST"): Promise<T> {
  const apiKey = process.env.ABACATEPAY_API_KEY;
  if (!apiKey) throw new Error("ABACATEPAY_API_KEY não configurada.");

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = (await res.json()) as AbacateEnvelope<T>;
  if (!res.ok || json.error || !json.success) {
    throw new Error(json.error ?? `AbacatePay request failed (${res.status}) on ${path}`);
  }
  return json.data as T;
}

type AbacateProduct = {
  id: string;
  externalId: string;
  cycle: string | null;
};

/** Cached across warm invocations of the same server process (best-effort — not relied on for correctness). */
let cachedProProductId: string | null = null;

async function findProProduct(): Promise<string | null> {
  const products = await abacateFetch<AbacateProduct[]>("/products/list", undefined, "GET");
  const existing = products.find((p) => p.externalId === PRO_PRODUCT_EXTERNAL_ID);
  return existing?.id ?? null;
}

/**
 * Finds (or creates, on first call) the AbacatePay product backing the Pro subscription.
 * Always re-checks the list rather than trusting the in-memory cache alone: concurrent
 * invocations (e.g. a double click, or Next.js dev running separate module instances per
 * route) can race past the cache check, so a create call can fail with "already exists"
 * even though this same process just created it — in that case we fall back to a fresh
 * list lookup instead of surfacing the conflict as an error.
 */
export async function ensureProProduct(): Promise<string> {
  if (cachedProProductId) return cachedProProductId;

  const existingId = await findProProduct();
  if (existingId) {
    cachedProProductId = existingId;
    return existingId;
  }

  try {
    const created = await abacateFetch<AbacateProduct>("/products/create", {
      externalId: PRO_PRODUCT_EXTERNAL_ID,
      name: "Trackpile Pro",
      description: "Vagas ilimitadas, calendário, lembretes de entrevista e anexos.",
      price: PRO_PRICE_CENTS,
      currency: "BRL",
      cycle: "MONTHLY",
    });
    cachedProProductId = created.id;
    return created.id;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (!/already exists/i.test(message)) throw err;

    const foundAfterConflict = await findProProduct();
    if (!foundAfterConflict) throw err;
    cachedProProductId = foundAfterConflict;
    return foundAfterConflict;
  }
}

type AbacateCustomer = {
  id: string;
  email: string;
};

/** Creates (or reuses, by taxId) an AbacatePay customer for the given trackpile user. */
export async function ensureCustomer(user: { email: string; name?: string | null }): Promise<string> {
  // Despite what the docs show, /customers/create expects a flat body — verified
  // empirically: a `{ data: {...} }` wrapper gets rejected with "Expected
  // property 'email' to be string but found: undefined".
  const customer = await abacateFetch<AbacateCustomer>("/customers/create", {
    email: user.email,
    name: user.name ?? undefined,
  });
  return customer.id;
}

type AbacateSubscription = {
  id: string;
  url: string;
};

export async function createProSubscription(params: {
  productId: string;
  customerId: string;
  userId: string;
  completionUrl: string;
  returnUrl: string;
}): Promise<{ id: string; url: string }> {
  const sub = await abacateFetch<AbacateSubscription>("/subscriptions/create", {
    items: [{ id: params.productId, quantity: 1 }],
    customerId: params.customerId,
    externalId: params.userId,
    completionUrl: params.completionUrl,
    returnUrl: params.returnUrl,
    methods: ["CARD"],
    metadata: { userId: params.userId },
  });
  return { id: sub.id, url: sub.url };
}

/**
 * Verifies the `X-Webhook-Signature` header AbacatePay sends with every webhook
 * call: HMAC-SHA256 of the raw request body, base64-encoded, keyed by the
 * webhook secret configured at https://docs.abacatepay.com/pages/webhooks/create.
 *
 * `rawBody` must be the untouched request body text — signing a re-serialized
 * JSON.stringify() of the parsed body will not match.
 */
export function verifyWebhookSignature(rawBody: string, signatureFromHeader: string | null): boolean {
  const secret = process.env.ABACATEPAY_WEBHOOK_SECRET;
  if (!secret || !signatureFromHeader) return false;

  const bodyBuffer = Buffer.from(rawBody, "utf8");
  const expectedSig = crypto.createHmac("sha256", secret).update(bodyBuffer).digest("base64");

  const a = Buffer.from(expectedSig);
  const b = Buffer.from(signatureFromHeader);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export type AbacateWebhookEvent = {
  id: string;
  event:
    | "subscription.completed"
    | "subscription.cancelled"
    | "subscription.renewed"
    | "subscription.trial_started"
    | string;
  apiVersion: number;
  devMode: boolean;
  data: {
    id?: string;
    externalId?: string | null;
    customerId?: string | null;
    metadata?: { userId?: string } | null;
    [key: string]: unknown;
  };
};
