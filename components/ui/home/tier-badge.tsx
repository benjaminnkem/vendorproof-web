import Image from "next/image";
import type { VendorTier } from "@/lib/data/mock-vendors";

const tierImageMap: Record<VendorTier, string> = {
  BRONZE: "/images/bronze.png",
  SILVER: "/images/silver.png",
  GOLD: "/images/gold.png",
  PLATINUM: "/images/platinum.png",
};

type TierBadgeProps = {
  tier: VendorTier;
};

export function TierBadge({ tier }: TierBadgeProps) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-canvas-border bg-canvas-elevated px-2.5 py-1 text-[11px] font-semibold text-slate-text">
      <Image
        src={tierImageMap[tier]}
        alt={`${tier} tier`}
        width={14}
        height={14}
        className="h-3.5 w-3.5"
      />
      {tier}
    </span>
  );
}
