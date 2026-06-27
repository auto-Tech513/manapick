type KvNamespace = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
};

type PagesContext = {
  request: Request;
  env: {
    LIKES?: KvNamespace;
  };
};

const MAX_IDS_PER_REQUEST = 100;
const VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{6,32}$/;
const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      ...JSON_HEADERS,
      ...(init.headers || {})
    }
  });
}

function parseIds(raw: string | null) {
  if (!raw) return [];
  return raw
    .split(",")
    .map((id) => id.trim())
    .filter((id, index, ids) => VIDEO_ID_PATTERN.test(id) && ids.indexOf(id) === index)
    .slice(0, MAX_IDS_PER_REQUEST);
}

async function readCount(likes: KvNamespace, id: string) {
  const raw = await likes.get(`like:count:${id}`);
  const count = Number(raw || 0);
  return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
}

function dayKey() {
  return new Date().toISOString().slice(0, 10);
}

function clientIp(request: Request) {
  const cfIp = request.headers.get("cf-connecting-ip");
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return cfIp || forwarded || "unknown";
}

async function sha256Hex(value: string) {
  const data = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function requestBodyId(request: Request) {
  try {
    const body = await request.json();
    return typeof body?.id === "string" ? body.id.trim() : "";
  } catch {
    return "";
  }
}

export async function onRequestGet({ request, env }: PagesContext) {
  if (!env.LIKES) {
    return json({ error: "LIKES binding is not configured", counts: {} }, { status: 503 });
  }

  const url = new URL(request.url);
  const ids = parseIds(url.searchParams.get("ids"));
  const counts: Record<string, number> = {};
  await Promise.all(
    ids.map(async (id) => {
      counts[id] = await readCount(env.LIKES as KvNamespace, id);
    })
  );

  return json({ counts });
}

export async function onRequestPost({ request, env }: PagesContext) {
  if (!env.LIKES) {
    return json({ error: "LIKES binding is not configured" }, { status: 503 });
  }

  const id = await requestBodyId(request);
  if (!VIDEO_ID_PATTERN.test(id)) {
    return json({ error: "invalid video id" }, { status: 400 });
  }

  const ipHash = await sha256Hex(clientIp(request));
  const guardKey = `like:guard:${dayKey()}:${id}:${ipHash}`;
  const guarded = await env.LIKES.get(guardKey);
  const currentCount = await readCount(env.LIKES, id);

  if (guarded) {
    return json({ id, count: currentCount, liked: false, guarded: true });
  }

  const nextCount = currentCount + 1;
  await Promise.all([
    env.LIKES.put(`like:count:${id}`, String(nextCount)),
    env.LIKES.put(guardKey, "1", { expirationTtl: 60 * 60 * 36 })
  ]);

  return json({ id, count: nextCount, liked: true, guarded: false });
}
