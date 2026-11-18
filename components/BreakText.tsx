import { Fragment } from "react";

// Renders text with <wbr> at precomputed phrase boundaries (lib/phrase-breaks.ts, build time).
// Safe in client components: it has no dependencies and simply mirrors the server output.
// One inline wrapper (`.bx`) holds the text so that a flex/grid parent sees a single item, and
// `.bx` resets every style (`all: unset`) so descendant `span` rules elsewhere cannot restyle it.
export default function BreakText({ text: raw, breaks }: { text: string; breaks?: number[] }) {
  // 閉じ括弧の直前の空白（「【ダビンチリゾルブ19 】」）で折れると括弧が行頭に来るので、改行しない空白にする（1字→1字で位置は不変）
  const text = raw.replace(/[ \u3000](?=[】」』）)〉》］\]])/g, "\u00a0");
  if (!breaks?.length) return <>{text}</>;
  const parts: string[] = [];
  let prev = 0;
  for (const b of breaks) {
    parts.push(text.slice(prev, b));
    prev = b;
  }
  parts.push(text.slice(prev));
  return (
    <span className="bx">
      {parts.map((part, index) => (
        <Fragment key={index}>
          {index ? <wbr /> : null}
          {part}
        </Fragment>
      ))}
    </span>
  );
}
