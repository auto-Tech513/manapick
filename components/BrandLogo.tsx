type BrandLogoProps = {
  compact?: boolean;
  className?: string;
};

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 96 96"
      role="img"
      aria-label="Manapick logo mark"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="manapickMarkGradient" x1="18" y1="76" x2="78" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1F3A8A" />
          <stop offset="1" stopColor="#0FA98B" />
        </linearGradient>
      </defs>
      <path
        d="M18 55 L34 72 L75 28"
        fill="none"
        stroke="url(#manapickMarkGradient)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M57 29 L76 25 L74 48"
        fill="none"
        stroke="#0FA98B"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M80 10 L84 21 L95 25 L84 29 L80 40 L76 29 L65 25 L76 21 Z" fill="#F59E0B" />
    </svg>
  );
}

export default function BrandLogo({ compact = false, className = "" }: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-line">
        <BrandMark className="h-8 w-8" />
      </span>
      <span className="leading-none">
        <span className="block text-[1.35rem] font-black tracking-normal text-[#1F3A8A] min-[520px]:text-2xl">
          Manapick
        </span>
        {!compact ? (
          <span className="mt-1 block text-[0.72rem] font-bold leading-tight text-ink/62 min-[520px]:text-xs">
            学び直しを、最短ルートに。
          </span>
        ) : null}
      </span>
    </span>
  );
}
