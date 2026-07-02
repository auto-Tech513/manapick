export type PrLinkKind = "book" | "course";
export type PrLinkStore = "rakuten" | "amazon" | "course" | "official";

export type PrLinkAction = {
  store: PrLinkStore;
  url: string;
  label?: string;
};

export type GuidePrLink = {
  label: string;
  url: string;
  note: string;
  kind?: PrLinkKind;
  store?: PrLinkStore;
  links?: PrLinkAction[];
};

export function prKindOf(item: GuidePrLink): PrLinkKind {
  return item.kind === "course" ? "course" : "book";
}

export function prActionsFor(item: GuidePrLink): PrLinkAction[] {
  if (item.links && item.links.length > 0) return item.links;

  return [
    {
      store: item.store ?? (item.kind === "course" ? "course" : "rakuten"),
      url: item.url
    }
  ];
}

export function prBadgeLabel(kind: PrLinkKind) {
  return kind === "course" ? "【PR】スクール・講座" : "【PR】書籍・教材";
}

export function prActionLabel(action: PrLinkAction, kind: PrLinkKind) {
  if (action.label) return action.label;
  if (action.store === "amazon") return "Amazonで見る";
  if (action.store === "rakuten") return "楽天ブックスで見る";
  return kind === "course" ? "公式サイトを見る" : "詳細を見る";
}
