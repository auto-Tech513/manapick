type KvNamespace = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
};

type Env = {
  LIKES?: KvNamespace;
};

type PagesContext = {
  request: Request;
  env: Env;
};

const MAX_IDS_PER_REQUEST = 60;
const GUARD_TTL_SECONDS = 60 * 60 * 26;
const YTID_RE = /^[A-Za-z0-9_-]{3,20}$/;

function json(data: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...init.headers
    }
  });
}

function parseIds(value: string | null) {
  if (!value) return [];
  return value
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

function validateIds(ids: string[]) {
  return ids.length > 0 && ids.length <= MAX_IDS_PER_REQUEST && ids.every((id) => YTID_RE.test(id));
}

async function readCount(kv: KvNamespace, id: string) {
  const raw = await kv.get(`c:${id}`);
  const count = Number(raw ?? 0);
  return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
}

export async function onRequestGet({ request, env }: PagesContext) {
  const url = new URL(request.url);
  const ids = parseIds(url.searchParams.get("ids"));
  if (!validateIds(ids)) {
    return json({ error: "invalid ids" }, { status: 400 });
  }

  if (!env.LIKES) {
    return json(
      { counts: Object.fromEntries(ids.map((id) => [id, 0])) },
      { headers: { "cache-control": "public, max-age=60" } }
    );
  }

  const entries = await Promise.all(ids.map(async (id) => [id, await readCount(env.LIKES as KvNamespace, id)] as const));
  return json(
    { counts: Object.fromEntries(entries) },
    { headers: { "cache-control": "public, max-age=60" } }
  );
}

export async function onRequestPost({ request, env }: PagesContext) {
  let body: { id?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid json" }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id.trim() : "";
  if (!YTID_RE.test(id)) {
    return json({ error: "invalid id" }, { status: 400 });
  }

  if (!env.LIKES) {
    return json({ id, count: 0, unavailable: true }, { status: 202 });
  }

  const ip =
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  const day = new Date().toISOString().slice(0, 10);
  const guardKey = `g:${day}:${id}:${ip}`;
  const countKey = `c:${id}`;
  const alreadyLiked = await env.LIKES.get(guardKey);

  if (alreadyLiked) {
    return json({ id, count: await readCount(env.LIKES, id) });
  }

  const nextCount = (await readCount(env.LIKES, id)) + 1;
  await Promise.all([
    env.LIKES.put(guardKey, "1", { expirationTtl: GUARD_TTL_SECONDS }),
    env.LIKES.put(countKey, String(nextCount))
  ]);

  return json({ id, count: nextCount });
}
