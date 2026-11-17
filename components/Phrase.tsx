import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";
import Link from "next/link";
import BreakText from "@/components/BreakText";
import { phraseBreaks } from "@/lib/phrase-breaks";

// Server component: inserts <wbr> at Japanese phrase boundaries in headings and titles so that
// iPhone Safari (no `word-break: auto-phrase`) does not split words such as 「カス｜タマイズ」.
// Adjacent text children are joined first ({tool.name}のほかのニュース → one phrase run).
// Text inside plain HTML elements and next/link is processed too; other components are left as is.
const TEXT_TAGS = new Set(["a", "span", "strong", "em", "b", "i", "small", "mark", "q", "cite", "abbr", "time", "bdi"]);

export default function Phrase({ children }: { children?: ReactNode }) {
  return <>{process(children)}</>;
}

function process(children: ReactNode): ReactNode[] {
  const out: ReactNode[] = [];
  let run = "";
  const flush = () => {
    if (run) out.push(<BreakText key={`t${out.length}`} text={run} breaks={phraseBreaks(run)} />);
    run = "";
  };
  Children.forEach(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      run += String(child);
      return;
    }
    flush();
    if (isValidElement(child)) {
      const el = child as ReactElement<{ children?: ReactNode }>;
      const key = el.key ?? `e${out.length}`;
      const textContainer = (typeof el.type === "string" && TEXT_TAGS.has(el.type)) || el.type === Link;
      out.push(textContainer && el.props.children !== undefined ? cloneElement(el, { key }, ...process(el.props.children)) : cloneElement(el, { key }));
      return;
    }
    if (child !== null && child !== undefined && typeof child !== "boolean") out.push(child);
  });
  flush();
  return out;
}
