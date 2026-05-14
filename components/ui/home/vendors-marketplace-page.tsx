"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  getBusinesses,
  mapBusinessToHomeVendorCard,
  type HomeVendorCardData,
  type SearchBusinessesParams,
} from "@/lib/service/business.service";
import { VendorCard } from "./vendor-card";

type SearchFormValues = {
  search: string;
  category: string;
};

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const apiMessage = error.response?.data?.message;
    if (typeof apiMessage === "string" && apiMessage.trim().length > 0) {
      return apiMessage;
    }
  }

  return "Unable to load vendors right now. Please try again shortly.";
}

export function VendorsMarketplacePage() {
  const form = useForm<SearchFormValues>({
    defaultValues: {
      search: "",
      category: "All",
    },
  });
  const [carouselIndices, setCarouselIndices] = useState<
    Record<string, number>
  >({});

  const businessesQuery = useQuery({
    queryKey: ["businesses", "all"],
    queryFn: () => getBusinesses(),
  });

  const searchBusinessesMutation = useMutation({
    mutationFn: (params: SearchBusinessesParams) => getBusinesses(params),
  });

  const sourceBusinesses =
    searchBusinessesMutation.data ?? businessesQuery.data ?? [];

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      (businessesQuery.data ?? [])
        .map((business) => business.category)
        .filter((category): category is string => Boolean(category)),
    );

    return ["All", ...Array.from(uniqueCategories)];
  }, [businessesQuery.data]);

  const filteredVendors = useMemo<HomeVendorCardData[]>(
    () =>
      sourceBusinesses.map((business) => mapBusinessToHomeVendorCard(business)),
    [sourceBusinesses],
  );

  const activeCategory = form.watch("category");
  const isBusy =
    businessesQuery.isLoading || searchBusinessesMutation.isPending;
  const currentError = searchBusinessesMutation.error ?? businessesQuery.error;

  function applyFilters(values: SearchFormValues) {
    const search = values.search.trim();
    const category = values.category === "All" ? "" : values.category;

    searchBusinessesMutation.mutate({
      ...(search ? { search } : {}),
      ...(category ? { category } : {}),
    });
  }

  function onCategorySelect(category: string) {
    form.setValue("category", category, {
      shouldDirty: true,
      shouldTouch: true,
    });
    form.handleSubmit(applyFilters)();
  }

  function onClearFilters() {
    form.reset({
      search: "",
      category: "All",
    });
    searchBusinessesMutation.reset();
  }

  function changeCarousel(slug: string, imageCount: number, direction: 1 | -1) {
    if (imageCount <= 1) {
      return;
    }

    setCarouselIndices((current) => {
      const existingIndex = current[slug] ?? 0;
      const nextIndex =
        direction === 1
          ? (existingIndex + 1) % imageCount
          : (existingIndex - 1 + imageCount) % imageCount;

      return {
        ...current,
        [slug]: nextIndex,
      };
    });
  }

  function setCarouselTo(slug: string, index: number) {
    setCarouselIndices((current) => ({
      ...current,
      [slug]: index,
    }));
  }

  return (
    <main className="vp-ambient-grid vp-page">
      <section className="vp-shell">
        <article className="vp-card p-6 sm:p-8">
          <p className="vp-kicker">VendorProof Marketplace</p>
          <h1 className="vp-headline mt-3 text-4xl sm:text-6xl">
            Vendors you can trust 🛡️
          </h1>
          <p className="vp-muted mt-4 max-w-3xl text-sm leading-6 sm:text-base">
            Discover verified vendors across multiple services, compare trust
            signals, and choose who to pay with confidence.
          </p>

          <form
            onSubmit={form.handleSubmit(applyFilters)}
            className="mt-6 flex gap-2 sm:items-center"
          >
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-canvas-border bg-canvas-elevated px-3 py-2">
              <MagnifyingGlassIcon className="h-5 w-5 text-indigo-200" />
              <input
                {...form.register("search")}
                placeholder="Search by vendor, service, or category"
                className="h-10 w-full bg-transparent text-sm text-slate-text outline-none placeholder:text-canvas-muted"
              />
            </div>

            <button
              type="submit"
              disabled={searchBusinessesMutation.isPending}
              className="rounded-full bg-chartwell-blue px-4 py-2.5 text-sm font-semibold text-cloud-white transition hover:-translate-y-0.5 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Search
            </button>

            <button
              type="button"
              onClick={onClearFilters}
              className="rounded-full border border-canvas-border px-4 py-2.5 text-sm font-semibold text-slate-text transition hover:border-hover-stone"
            >
              Reset
            </button>
          </form>

          <div className="mt-4 -mx-1 overflow-x-auto px-1 pb-1">
            <div className="flex min-w-max gap-2">
              {categories.map((category) => {
                const selected = category === activeCategory;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => onCategorySelect(category)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                      selected
                        ? "border-chartwell-blue bg-chartwell-blue text-cloud-white"
                        : "border-canvas-border text-slate-text hover:border-hover-stone"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          {currentError ? (
            <p className="mt-3 text-sm text-rose-300">
              {getErrorMessage(currentError)}
            </p>
          ) : null}
        </article>

        {isBusy ? (
          <div className="vp-card mt-4 p-6 text-center">
            <p className="vp-muted text-sm">Loading trusted vendors...</p>
          </div>
        ) : null}

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredVendors.map((vendor) => (
            <VendorCard
              key={vendor.business.slug}
              vendor={vendor}
              imageIndex={carouselIndices[vendor.business.slug] ?? 0}
              onPreviousImage={() =>
                changeCarousel(
                  vendor.business.slug,
                  vendor.business.showcaseImages.length > 0
                    ? vendor.business.showcaseImages.length
                    : 1,
                  -1,
                )
              }
              onNextImage={() =>
                changeCarousel(
                  vendor.business.slug,
                  vendor.business.showcaseImages.length > 0
                    ? vendor.business.showcaseImages.length
                    : 1,
                  1,
                )
              }
              onSelectImage={(index) =>
                setCarouselTo(vendor.business.slug, index)
              }
            />
          ))}
        </div>

        {filteredVendors.length === 0 ? (
          <div className="vp-card mt-4 p-6 text-center">
            <p className="vp-headline text-2xl">No vendors found</p>
            <p className="vp-muted mt-2 text-sm">
              Try another keyword or clear your search filters.
            </p>
          </div>
        ) : null}
      </section>
    </main>
  );
}
