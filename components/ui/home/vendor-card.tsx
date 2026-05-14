import Link from "next/link";
import {
  ArrowTopRightOnSquareIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import type { HomeVendorCardData } from "@/lib/service/business.service";
import { TierBadge } from "./tier-badge";
import { VendorShowcaseCarousel } from "./vendor-showcase-carousel";

type VendorCardProps = {
  vendor: HomeVendorCardData;
  imageIndex: number;
  onPreviousImage: () => void;
  onNextImage: () => void;
  onSelectImage: (index: number) => void;
};

export function VendorCard({
  vendor,
  imageIndex,
  onPreviousImage,
  onNextImage,
  onSelectImage,
}: VendorCardProps) {
  const imageSet =
    vendor.business.showcaseImages.length > 0
      ? vendor.business.showcaseImages
      : [vendor.business.logo];

  return (
    <article className="vp-card overflow-hidden p-3 transition-transform duration-200 hover:-translate-y-0.5">
      <VendorShowcaseCarousel
        imageSet={imageSet}
        imageIndex={imageIndex}
        vendorName={vendor.business.name}
        onPrevious={onPreviousImage}
        onNext={onNextImage}
        onSelect={onSelectImage}
      />

      <div className="px-1 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold tracking-[0.1em] text-indigo-200 uppercase">
              {vendor.category}
            </p>

            <div className="mt-1 flex items-center gap-2">
              <img
                src={vendor.business.logo}
                alt={`${vendor.business.name} logo`}
                className="h-7 w-7 rounded-md border border-canvas-border object-cover"
                loading="lazy"
              />
              <h2 className="vp-headline truncate text-xl">
                {vendor.business.name}
              </h2>
            </div>
          </div>

          <TierBadge tier={vendor.business.tier.name} />
        </div>

        <p className="vp-muted mt-2 line-clamp-2 text-sm">
          {vendor.business.description}
        </p>

        <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-canvas-border bg-canvas-elevated px-3 py-2">
          <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-text">
            <ShieldCheckIcon className="h-4 w-4 text-chartwell-blue" />
            {vendor.business.trustScore.toFixed(1)} Trust Score
          </p>
          <p className="vp-muted text-xs">
            {vendor.ratingSummary.toFixed(1)} ({vendor.ratingCount})
          </p>
        </div>

        <Link
          href={`/vendor/${vendor.business.slug}`}
          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-chartwell-blue px-4 py-2.5 text-sm font-semibold text-cloud-white transition hover:-translate-y-0.5 hover:brightness-95"
        >
          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          Open vendor page
        </Link>
      </div>
    </article>
  );
}
