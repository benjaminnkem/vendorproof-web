import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

type VendorShowcaseCarouselProps = {
  imageSet: string[];
  imageIndex: number;
  vendorName: string;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
};

export function VendorShowcaseCarousel({
  imageSet,
  imageIndex,
  vendorName,
  onPrevious,
  onNext,
  onSelect,
}: VendorShowcaseCarouselProps) {
  const currentImage = imageSet[imageIndex] ?? imageSet[0];

  return (
    <div className="relative overflow-hidden rounded-xl border border-canvas-border bg-canvas-surface">
      <img
        src={currentImage}
        alt={`${vendorName} showcase`}
        className="h-44 w-full object-cover"
        loading="lazy"
      />

      {imageSet.length > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={onPrevious}
            className="absolute top-1/2 left-2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full border border-canvas-border bg-canvas-surface/80 text-slate-text backdrop-blur"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={onNext}
            className="absolute top-1/2 right-2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full border border-canvas-border bg-canvas-surface/80 text-slate-text backdrop-blur"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>

          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            {imageSet.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Go to image ${index + 1}`}
                onClick={() => onSelect(index)}
                className={`h-1.5 rounded-full transition ${
                  index === imageIndex
                    ? "w-5 bg-chartwell-blue"
                    : "w-2 bg-canvas-fog"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
