// 学習プランをカレンダーへ書き出すための純粋関数。
// - iPhone / Mac / Android 標準カレンダー向け: RFC 5545 の .ics（UTC 時刻、CRLF、75オクテット折り返し）
// - Google カレンダー向け: calendar.google.com/calendar/render?action=TEMPLATE のイベント作成リンク（1リンク=1予定）

export const SITE_ORIGIN = "https://manapick.app";

export type CalendarEvent = {
  uid: string;
  title: string;
  description: string;
  url: string;
  start: Date;
  end: Date;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

// 20261103T120000Z 形式（UTC）。Google の dates パラメータと .ics の DTSTART/DTEND で共通に使う。
export function toUtcStamp(date: Date) {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
}

// RFC 5545 3.3.11: バックスラッシュ・セミコロン・カンマ・改行をエスケープする。
function escapeText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

// RFC 5545 3.1: 1行75オクテットを超える場合は CRLF + 空白で折り返す。UTF-8 の文字境界では分割しない。
function foldLine(line: string) {
  const encoder = new TextEncoder();
  const parts: string[] = [];
  let current = "";
  let currentBytes = 0;
  for (const char of line) {
    const bytes = encoder.encode(char).length;
    const limit = parts.length === 0 ? 75 : 74; // 継続行は先頭の空白1オクテット分を差し引く
    if (currentBytes + bytes > limit) {
      parts.push(current);
      current = "";
      currentBytes = 0;
    }
    current += char;
    currentBytes += bytes;
  }
  parts.push(current);
  return parts.join("\r\n ");
}

export function buildIcs(events: CalendarEvent[], calendarName: string, now = new Date()) {
  const stamp = toUtcStamp(now);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Manapick//Study Plan//JA",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(calendarName)}`
  ];
  for (const event of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${event.uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${toUtcStamp(event.start)}`,
      `DTEND:${toUtcStamp(event.end)}`,
      `SUMMARY:${escapeText(event.title)}`,
      `DESCRIPTION:${escapeText(event.description)}`,
      `URL:${event.url}`,
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeText(event.title)}`,
      "TRIGGER:-PT10M",
      "END:VALARM",
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.map(foldLine).join("\r\n") + "\r\n";
}

export function googleCalendarUrl(event: CalendarEvent) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toUtcStamp(event.start)}/${toUtcStamp(event.end)}`,
    details: event.description
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// "2026-11-03" と "21:00" から端末のローカル時刻として Date を作る（タイムゾーンは端末設定に従う）。
export function localDateTime(dateValue: string, timeValue: string, dayOffset: number) {
  const [year, month, day] = dateValue.split("-").map(Number);
  const [hour, minute] = timeValue.split(":").map(Number);
  if (![year, month, day, hour, minute].every(Number.isFinite)) return null;
  return new Date(year, month - 1, day + dayOffset, hour, minute, 0, 0);
}

export function toDateInputValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
