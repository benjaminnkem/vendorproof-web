"use client";

import {
  ArrowTopRightOnSquareIcon,
  CheckBadgeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClipboardDocumentIcon,
  ExclamationTriangleIcon,
  LinkIcon,
  PhotoIcon,
  PhoneIcon,
  ShareIcon,
  StarIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useMemo, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import type {
  SocialPlatform,
  VendorProfilePageData,
} from "@/lib/service/vendor-profile.service";
import Link from "next/link";

type VendorProfilePageProps = {
  vendor: VendorProfilePageData;
};

const socialIconMap: Partial<Record<SocialPlatform, string>> = {
  FACEBOOK: "/images/facebook.png",
  TWITTER: "/images/x.png",
  LINKEDIN: "/images/linkedin.png",
  INSTAGRAM: "/images/instagram.png",
  WHATSAPP: "/images/whatsapp.png",
  TIKTOK: "/images/tiktok.png",
  YOUTUBE: "/images/youtube.png",
};

const socialLabelMap: Record<SocialPlatform, string> = {
  FACEBOOK: "Facebook",
  TWITTER: "Twitter",
  LINKEDIN: "LinkedIn",
  INSTAGRAM: "Instagram",
  WHATSAPP: "WhatsApp",
  TIKTOK: "TikTok",
  YOUTUBE: "YouTube",
  WEBSITE: "Website",
  OTHER: "Other",
};

const ratingLabels = [5, 4, 3, 2, 1] as const;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactCurrency(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
  });
}

export function VendorProfilePage({ vendor }: VendorProfilePageProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [cardOpen, setCardOpen] = useState(false);

  const trustSeries = vendor.business.trustScoreHistories.map((point) => ({
    date: formatDate(point.createdAt),
    score: Number(point.score.toFixed(1)),
  }));

  const ratingDistribution = useMemo(() => {
    const total = Math.max(vendor.ratingCount, 1);

    return ratingLabels.map((rating) => {
      const count = vendor.reviews.filter(
        (review) => Math.round(review.rating) === rating,
      ).length;

      return {
        rating,
        count,
        percentage: (count / total) * 100,
      };
    });
  }, [vendor.ratingCount, vendor.reviews]);

  const profileLink =
    vendor.socials.find((social) => social.platform === "WEBSITE")?.url ||
    `https://vendorproof.example/vendor/${vendor.business.slug}`;

  const showcase = vendor.business.showcaseImages;

  const nextImage = () => {
    if (showcase.length === 0) {
      return;
    }
    setActiveImageIndex((current) =>
      current + 1 >= showcase.length ? 0 : current + 1,
    );
  };

  const prevImage = () => {
    if (showcase.length === 0) {
      return;
    }
    setActiveImageIndex((current) =>
      current - 1 < 0 ? showcase.length - 1 : current - 1,
    );
  };

  const openImage = (index: number) => {
    setActiveImageIndex(index);
    setGalleryOpen(true);
  };

  const copyProfileLink = async () => {
    try {
      await navigator.clipboard.writeText(profileLink);
    } catch {
      window.prompt("Copy profile link", profileLink);
    }
  };

  const shareProfile = async () => {
    if (typeof navigator === "undefined") {
      return;
    }

    if ("share" in navigator) {
      try {
        await navigator.share({
          title: `${vendor.business.name} on VendorProof`,
          text: "View this verified vendor profile.",
          url: profileLink,
        });
      } catch {
        await copyProfileLink();
      }
      return;
    }

    await copyProfileLink();
  };

  useEffect(() => {
    if (!galleryOpen || showcase.length === 0) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        nextImage();
      }
      if (event.key === "ArrowLeft") {
        prevImage();
      }
      if (event.key === "Escape") {
        setGalleryOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [galleryOpen, showcase.length]);

  return (
    <div className="relative overflow-hidden pb-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-20%] right-[-18%] h-[38rem] w-[38rem] rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-[-16%] left-[-16%] h-[30rem] w-[30rem] rounded-full bg-teal-500/8 blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(136,146,164,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(136,146,164,0.45)_1px,transparent_1px)] [background-size:52px_52px]" />
      </div>

      <div className="relative mx-auto w-full max-w-[1280px] px-1 sm:px-2">
        <section className="grid items-start gap-10 pt-4 lg:grid-cols-[minmax(0,1fr)_310px] lg:gap-14 xl:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
            className="space-y-7"
          >
            <p className="vp-kicker">VendorProof identity</p>

            <div className="flex flex-wrap items-center gap-2">
              {vendor.socials.map((social) => (
                <a
                  key={`${social.platform}-${social.url}`}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-canvas-border/80 bg-canvas-surface/75 transition hover:-translate-y-0.5 hover:border-indigo-400 hover:bg-canvas-elevated"
                  aria-label={socialLabelMap[social.platform]}
                >
                  {social.platform === "WEBSITE" ||
                  !socialIconMap[social.platform] ? (
                    <LinkIcon className="h-4 w-4 text-indigo-200" />
                  ) : (
                    <img
                      src={socialIconMap[social.platform]}
                      alt={socialLabelMap[social.platform]}
                      className="h-4 w-4 object-contain"
                    />
                  )}
                </a>
              ))}
            </div>

            <div>
              <h1 className="vp-headline text-5xl leading-[0.94] text-slate-text sm:text-6xl md:text-7xl xl:text-8xl">
                {vendor.business.name}
              </h1>
              <p className="vp-muted mt-5 max-w-2xl text-base leading-relaxed sm:text-lg">
                {vendor.business.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              <MetaItem label={vendor.category} />
              <MetaItem label={vendor.business.tier.name} />
              <MetaItem label={`${vendor.ratingSummary.toFixed(1)} rating`} />
              <span className="inline-flex items-center gap-1 rounded-full border border-teal-500/35 bg-teal-500/10 px-2.5 py-1 text-xs font-semibold text-teal-300">
                <CheckBadgeIcon className="h-3.5 w-3.5" />
                {vendor.business.kycStatus}
              </span>
            </div>

            <div className="grid gap-3 text-sm text-indigo-100 sm:grid-cols-2 sm:gap-x-8">
              <p className="inline-flex items-center gap-2">
                <PhoneIcon className="h-4 w-4 text-indigo-300" />
                {vendor.businessPhoneNumber}
              </p>
              {vendor.alternativePhoneNumber ? (
                <p className="inline-flex items-center gap-2 vp-muted">
                  <PhoneIcon className="h-4 w-4 text-indigo-300" />
                  {vendor.alternativePhoneNumber}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href={vendor.business?.paymentLink ?? ""}>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700"
                >
                  Make Payment <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </button>
              </Link>
              <Dialog.Root open={cardOpen} onOpenChange={setCardOpen}>
                <Dialog.Trigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700"
                  >
                    <UserGroupIcon className="h-4 w-4" />
                    View Vendor Card
                  </button>
                </Dialog.Trigger>
                <VendorCardDialog
                  vendor={vendor}
                  profileLink={profileLink}
                  copyProfileLink={copyProfileLink}
                  shareProfile={shareProfile}
                />
              </Dialog.Root>

              <Dialog.Root open={reportOpen} onOpenChange={setReportOpen}>
                <Dialog.Trigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full border border-alert-700/45 bg-alert-900/25 px-5 py-2.5 text-sm font-semibold text-alert-300 transition hover:-translate-y-0.5 hover:bg-alert-900/40"
                  >
                    <ExclamationTriangleIcon className="h-4 w-4" />
                    Report Vendor
                  </button>
                </Dialog.Trigger>
                <ReportDialog vendorName={vendor.business.name} />
              </Dialog.Root>
            </div>

            {showcase.length > 0 ? (
              <div className="relative mt-3 overflow-hidden rounded-[26px] border border-canvas-border/80 bg-canvas-surface/80">
                <img
                  src={showcase[0]}
                  alt={`${vendor.business.name} showcase hero`}
                  className="h-[16rem] w-full object-cover sm:h-[20rem]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/75 via-canvas/15 to-transparent" />
                <button
                  type="button"
                  onClick={() => openImage(0)}
                  className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full border border-canvas-border bg-canvas-elevated/90 px-4 py-2 text-xs font-semibold text-indigo-100 transition hover:-translate-y-0.5 hover:border-indigo-400"
                >
                  <PhotoIcon className="h-4 w-4" />
                  View More Images
                </button>
              </div>
            ) : null}
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.46, ease: "easeOut", delay: 0.06 }}
            className="relative overflow-hidden rounded-[28px] border border-canvas-border bg-canvas-surface/85 p-6 backdrop-blur lg:sticky lg:top-6"
          >
            <div className="pointer-events-none absolute -top-24 -right-20 h-52 w-52 rounded-full bg-indigo-500/18 blur-3xl" />
            <p className="relative text-[11px] font-semibold tracking-[0.16em] text-indigo-200 uppercase">
              Financial identity
            </p>
            <p className="relative mt-2 vp-stat-value text-5xl leading-none font-semibold text-slate-text">
              {vendor.business.trustScore.toFixed(1)}
            </p>
            <p className="relative mt-1 text-xs font-medium tracking-[0.08em] text-indigo-200 uppercase">
              Trust Score / 100
            </p>

            <div className="relative mt-6 space-y-3 text-sm">
              <IdentityLine
                label="Amount Processed"
                value={`${formatCompactCurrency(vendor.totalAmountTransacted)}+`}
              />
              <IdentityLine label="Trust Growth" value={vendor.trustGrowth} />
            </div>

            <div className="relative mt-6 flex items-center justify-between rounded-2xl border border-canvas-border/80 bg-canvas-elevated/70 p-3">
              <div>
                <p className="text-xs tracking-[0.08em] uppercase vp-muted">
                  Scan
                </p>
                <p className="mt-1 text-xs font-semibold text-indigo-100">
                  Verified profile link
                </p>
              </div>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(profileLink)}`}
                alt="Vendor profile QR code"
                className="h-16 w-16 rounded-md border border-canvas-border bg-white p-1"
              />
            </div>
          </motion.aside>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:mt-20"
        >
          <div className="rounded-[26px] border border-canvas-border/80 bg-canvas-surface/70 p-5 backdrop-blur sm:p-7">
            <p className="text-xs font-semibold tracking-[0.14em] text-indigo-200 uppercase">
              Trust timeline
            </p>
            <div className="mt-5 h-[260px] w-full sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trustSeries} margin={{ left: -10, right: 10 }}>
                  <CartesianGrid
                    stroke="rgba(136,146,164,0.12)"
                    vertical={false}
                    strokeDasharray="3 8"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#8892A4", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "#8892A4", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={34}
                  />
                  <RechartsTooltip
                    cursor={{ stroke: "#2D3FCC", strokeOpacity: 0.45 }}
                    contentStyle={{
                      backgroundColor: "#111829",
                      borderColor: "#1E2535",
                      color: "#E5ECFF",
                      borderRadius: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#4361EE"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive
                    animationDuration={750}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6 py-2">
            <SignalAccent
              label="Amount processed"
              value={`${formatCurrency(vendor.totalAmountTransacted)}+`}
            />
            <SignalAccent
              label="Successful payments"
              value={vendor.successfulTransactions}
            />
            <SignalAccent
              label="Verified buyers"
              value={vendor.totalVerifiedBuyers}
            />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.42, ease: "easeOut" }}
          className="mt-20 grid gap-14 xl:grid-cols-[0.65fr_minmax(0,1fr)]"
        >
          <div>
            <p className="vp-kicker">Services</p>
            <h2 className="vp-headline mt-2 text-3xl text-slate-text sm:text-5xl">
              Capabilities and operating range
            </h2>
            {vendor.serviceInfo ? (
              <p className="vp-muted mt-4 max-w-md text-sm leading-relaxed">
                {vendor.serviceInfo}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-3">
            {vendor.servicesOffered.map((service, index) => (
              <motion.span
                key={service}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="inline-flex items-center rounded-full border border-canvas-border/80 bg-canvas-surface/70 px-4 py-2.5 text-sm text-indigo-100 transition hover:-translate-y-0.5 hover:border-indigo-400 hover:bg-canvas-elevated"
              >
                {service}
              </motion.span>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="mt-20 grid gap-12 xl:grid-cols-[320px_minmax(0,1fr)]"
        >
          <div>
            <p className="vp-kicker">Reviews</p>
            <div className="mt-4 flex items-baseline gap-3">
              <p className="vp-stat-value text-5xl font-semibold text-slate-text">
                {vendor.ratingSummary.toFixed(1)}
              </p>
              <p className="text-sm vp-muted">
                / 5 from {vendor.ratingCount} buyers
              </p>
            </div>

            <div className="mt-5 space-y-2">
              {ratingDistribution.map((row) => (
                <div key={row.rating} className="flex items-center gap-2">
                  <span className="w-4 text-xs vp-muted">{row.rating}</span>
                  <div className="h-1.5 flex-1 rounded-full bg-canvas-border/90">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${row.percentage}%` }}
                    />
                  </div>
                  <span className="w-7 text-right text-xs vp-muted">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {vendor.reviews.map((review, index) => (
              <article
                key={`${review.createdAt}-${index}`}
                className="border-b border-canvas-border/70 pb-7 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center gap-0.5 text-gold-500">
                  {[1, 2, 3, 4, 5].map((value) =>
                    value <= Math.round(review.rating) ? (
                      <StarIconSolid key={value} className="h-4 w-4" />
                    ) : (
                      <StarIcon
                        key={value}
                        className="h-4 w-4 text-canvas-muted"
                      />
                    ),
                  )}
                </div>

                {review.comment ? (
                  <p className="mt-3 max-w-3xl text-[15px] leading-7 text-indigo-50/90 sm:text-base">
                    {review.comment}
                  </p>
                ) : null}

                <p className="vp-muted mt-3 text-xs tracking-[0.06em] uppercase">
                  {review.reviewerName || "Anonymous"} ·{" "}
                  {new Date(review.createdAt).toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </article>
            ))}
          </div>
        </motion.section>

        <div className="mt-16 flex flex-wrap items-center justify-end gap-2 border-t border-canvas-border/70 pt-8">
          <button
            type="button"
            onClick={copyProfileLink}
            className="inline-flex items-center gap-1.5 rounded-full border border-canvas-border px-4 py-2 text-sm text-indigo-100 transition hover:-translate-y-0.5 hover:border-indigo-400"
          >
            <ClipboardDocumentIcon className="h-4 w-4" />
            Copy profile link
          </button>
          <button
            type="button"
            onClick={shareProfile}
            className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700"
          >
            <ShareIcon className="h-4 w-4" />
            Share profile
          </button>
        </div>
      </div>

      <Dialog.Root open={galleryOpen} onOpenChange={setGalleryOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/82 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <div className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-canvas-border bg-canvas-surface/95 p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between">
                <Dialog.Title className="text-xs font-semibold tracking-[0.12em] text-indigo-200 uppercase">
                  Showcase Gallery
                </Dialog.Title>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="rounded-md p-1 text-canvas-muted transition hover:bg-canvas-border"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </Dialog.Close>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-canvas-border bg-canvas-elevated">
                <AnimatePresence mode="wait">
                  {showcase[activeImageIndex] ? (
                    <motion.img
                      key={showcase[activeImageIndex]}
                      src={showcase[activeImageIndex]}
                      alt={`${vendor.business.name} showcase image ${activeImageIndex + 1}`}
                      className="h-[58vh] w-full object-cover sm:h-[68vh]"
                      initial={{ opacity: 0.65, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0.65, scale: 0.99 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -90) {
                          nextImage();
                        }
                        if (info.offset.x > 90) {
                          prevImage();
                        }
                      }}
                    />
                  ) : (
                    <div className="grid h-[58vh] place-items-center sm:h-[68vh]">
                      <p className="vp-muted text-sm">
                        No showcase image available.
                      </p>
                    </div>
                  )}
                </AnimatePresence>

                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute top-1/2 left-3 inline-flex -translate-y-1/2 items-center gap-1 rounded-full border border-canvas-border bg-canvas-elevated/90 px-3 py-1.5 text-xs font-semibold text-indigo-100 transition hover:border-indigo-400"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  Prev
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute top-1/2 right-3 inline-flex -translate-y-1/2 items-center gap-1 rounded-full border border-canvas-border bg-canvas-elevated/90 px-3 py-1.5 text-xs font-semibold text-indigo-100 transition hover:border-indigo-400"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                  Next
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

type VendorCardDialogProps = {
  vendor: VendorProfilePageData;
  profileLink: string;
  copyProfileLink: () => Promise<void>;
  shareProfile: () => Promise<void>;
};

function VendorCardDialog({
  vendor,
  profileLink,
  copyProfileLink,
  shareProfile,
}: VendorCardDialogProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm" />
      <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[94vw] max-w-2xl -translate-x-1/2 -translate-y-1/2">
        <div className="relative overflow-hidden rounded-[28px] border border-canvas-border bg-canvas-surface p-5 shadow-2xl sm:p-7">
          <div className="pointer-events-none absolute -top-28 -right-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-teal-500/10 blur-3xl" />

          <div className="relative flex items-start justify-between gap-3">
            <Dialog.Title className="text-sm font-semibold tracking-[0.12em] text-indigo-200 uppercase">
              VendorProof Card
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-md p-1 text-canvas-muted transition hover:bg-canvas-border"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="relative mt-4 px-2 py-4 sm:px-6">
            <div className="relative mx-auto max-w-[540px] rotate-[-3deg] overflow-hidden rounded-[22px] border border-canvas-border/80 bg-gradient-to-br from-canvas-elevated to-canvas-surface p-5 shadow-[0_24px_60px_rgba(0,0,0,0.45)] sm:p-6">
              <div className="pointer-events-none absolute right-0 bottom-[-14px] text-[6rem] leading-none font-bold tracking-[-0.04em] text-white/7 sm:text-[7rem]">
                vendorproof
              </div>

              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-lg border border-canvas-border bg-canvas-surface">
                      <img
                        src={vendor.business.logo}
                        alt={`${vendor.business.name} logo`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.14em] text-indigo-200 uppercase">
                        Verified merchant ID
                      </p>
                      <h3 className="vp-headline mt-1 truncate text-2xl text-slate-text sm:text-3xl">
                        {vendor.business.name}
                      </h3>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                    <CardData
                      label="Category"
                      value={vendor.category}
                      icon={UserGroupIcon}
                    />
                    <CardData
                      label="Trust Score"
                      value={`${vendor.business.trustScore.toFixed(1)} / 100`}
                      icon={StarIcon}
                    />
                    <CardData
                      label="Tier"
                      value={vendor.business.tier.name}
                      icon={CheckBadgeIcon}
                    />
                    <CardData
                      label="Phone"
                      value={vendor.businessPhoneNumber}
                      icon={PhoneIcon}
                    />
                  </div>
                </div>

                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(profileLink)}`}
                  alt="Vendor profile QR code"
                  className="h-24 w-24 shrink-0 rounded-md border border-canvas-border bg-white p-1 sm:h-28 sm:w-28"
                />
              </div>

              {vendor.alternativePhoneNumber ? (
                <p className="relative mt-3 inline-flex items-center gap-1.5 text-[11px] text-indigo-200">
                  <PhoneIcon className="h-3.5 w-3.5" />
                  Alt: {vendor.alternativePhoneNumber}
                </p>
              ) : null}

              <p className="relative mt-2 truncate text-[11px] tracking-[0.08em] text-indigo-200 uppercase">
                {profileLink}
              </p>
            </div>
          </div>

          <div className="relative mt-5 flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={copyProfileLink}
              className="inline-flex items-center gap-1.5 rounded-full border border-canvas-border px-4 py-2 text-sm text-indigo-100 transition hover:-translate-y-0.5 hover:border-indigo-400"
            >
              <ClipboardDocumentIcon className="h-4 w-4" />
              Copy Link
            </button>
            <button
              type="button"
              onClick={shareProfile}
              className="inline-flex items-center gap-1.5 rounded-full border border-canvas-border px-4 py-2 text-sm text-indigo-100 transition hover:-translate-y-0.5 hover:border-indigo-400"
            >
              <ShareIcon className="h-4 w-4" />
              Share
            </button>
            <a
              href={profileLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-indigo-700"
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              Open Profile
            </a>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

type CardDataProps = {
  label: string;
  value: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

function CardData({ label, value, icon: Icon }: CardDataProps) {
  return (
    <p className="rounded-lg border border-canvas-border/80 bg-canvas-surface/70 px-3 py-2">
      <span className="inline-flex items-center gap-1.5 vp-muted text-[10px] tracking-[0.1em] uppercase">
        {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
        {label}
      </span>
      <span className="mt-0.5 block text-sm font-medium text-indigo-50">
        {value}
      </span>
    </p>
  );
}

type ReportDialogProps = {
  vendorName: string;
};

function ReportDialog({ vendorName }: ReportDialogProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-black/65 backdrop-blur-sm" />
      <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-canvas-border bg-canvas-surface p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Dialog.Title className="text-lg font-semibold text-slate-text">
              Confirm Vendor Report
            </Dialog.Title>
            <Dialog.Description className="mt-1 text-sm vp-muted">
              This will flag {vendorName} for moderation review.
            </Dialog.Description>
          </div>
          <Dialog.Close asChild>
            <button
              type="button"
              className="rounded-md p-1 text-canvas-muted hover:bg-canvas-border"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <Dialog.Close asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-canvas-border px-4 py-2 text-sm text-indigo-100"
            >
              <XMarkIcon className="h-4 w-4" />
              Cancel
            </button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-alert-500 px-4 py-2 text-sm font-semibold text-white"
            >
              <ExclamationTriangleIcon className="h-4 w-4" />
              Confirm Report
            </button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}

type SignalAccentProps = {
  label: string;
  value: string;
  subtle?: boolean;
};

function SignalAccent({ label, value, subtle }: SignalAccentProps) {
  return (
    <div className={subtle ? "space-y-1" : "space-y-2"}>
      <p className="text-xs font-semibold tracking-[0.1em] text-indigo-200 uppercase">
        {label}
      </p>
      <p
        className={
          subtle
            ? "text-xl font-semibold text-slate-text/95"
            : "vp-stat-value text-2xl leading-tight font-semibold text-slate-text sm:text-3xl"
        }
      >
        {value}
      </p>
    </div>
  );
}

type IdentityLineProps = {
  label: string;
  value: string;
};

function IdentityLine({ label, value }: IdentityLineProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-canvas-border/70 pb-2 text-sm last:border-b-0 last:pb-0">
      <span className="vp-muted text-xs tracking-[0.06em] uppercase">
        {label}
      </span>
      <span className="vp-stat-value text-indigo-50">{value}</span>
    </div>
  );
}

type MetaItemProps = {
  label: string;
};

function MetaItem({ label }: MetaItemProps) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-indigo-100 sm:text-sm">
      <span className="h-1 w-1 rounded-full bg-indigo-300" />
      {label}
    </span>
  );
}
