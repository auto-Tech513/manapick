// IndexNow へ URL リストを送信する。URL は標準入力の JSON 配列で受け取る。
// キーは公開情報（サイト上のキーファイルと一致させる仕組み）なので直書きする。
const KEY = "243fd2be1fb169411b0e9318aa4bbae0";
const chunks = [];
for await (const c of process.stdin) chunks.push(c);
const urls = JSON.parse(Buffer.concat(chunks).toString("utf8") || "[]");
if (!Array.isArray(urls) || urls.length === 0) { console.log("indexnow: no urls, skip"); process.exit(0); }
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: "manapick.app", key: KEY, keyLocation: "https://manapick.app/" + KEY + ".txt", urlList: urls.slice(0, 10000) })
});
console.log("indexnow: submitted", Math.min(urls.length, 10000), "urls -> HTTP", res.status, res.statusText);
if (res.status !== 200 && res.status !== 202) { console.error(await res.text()); process.exit(1); }
