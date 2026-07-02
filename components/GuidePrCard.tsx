import TrackedPrLink from "@/components/TrackedPrLink";
import { prActionLabel, prActionsFor, prBadgeLabel, prKindOf, type GuidePrLink } from "@/lib/pr-links";

type GuidePrCardProps = {
  genre: string;
  item: GuidePrLink;
  placement: string;
};

export default function GuidePrCard({ genre, item, placement }: GuidePrCardProps) {
  const kind = prKindOf(item);
  const actions = prActionsFor(item);

  return (
    <article className="guide-pr-card is-affiliate">
      <span className="guide-pr-card-pr">{prBadgeLabel(kind)}</span>
      <strong>{item.label}</strong>
      <span>{item.note}</span>
      <div className="guide-pr-action-row" aria-label={item.label + "の購入・申込先"}>
        {actions.map((action) => (
          <TrackedPrLink
            key={action.store + action.url}
            className={"guide-pr-action is-" + action.store}
            href={action.url}
            genre={genre}
            kind={kind}
            label={item.label}
            placement={placement}
            store={action.store}
          >
            {prActionLabel(action, kind)}
          </TrackedPrLink>
        ))}
      </div>
    </article>
  );
}
