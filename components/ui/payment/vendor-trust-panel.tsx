"use client";

import {
  ArrowTopRightOnSquareIcon,
  ArrowTrendingUpIcon,
  CheckBadgeIcon,
  LinkIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import type {
  PublicPaymentPageData,
  SocialPlatform,
  VendorTier,
} from "@/lib/service/payment.service";
import { TrustScoreGauge } from "./trust-score-gauge";

type VendorTrustPanelProps = {
  vendor: PublicPaymentPageData;
};

const tierStyles: Record<VendorTier, string> = {
  BRONZE:
    "border-[#d9c2a3] bg-[#f6eee4] text-[#8b5a2b] dark:border-[#7a5a3a] dark:bg-[#2e2419] dark:text-[#f1d5b0]",
  SILVER:
    "border-[#cdd3db] bg-[#eef2f7] text-[#4d5c74] dark:border-[#516176] dark:bg-[#1f2734] dark:text-[#cfd9e8]",
  GOLD: "border-[#e7d18a] bg-[#fbf5de] text-[#8a6b11] dark:border-[#8b7434] dark:bg-[#2f2813] dark:text-[#f2e1a4]",
  PLATINUM:
    "border-[#cfd6e4] bg-[#eef3fb] text-[#394d7a] dark:border-[#566687] dark:bg-[#1e2536] dark:text-[#d7e1f5]",
};

const tierCopy: Record<VendorTier, { label: string; detail: string }> = {
  BRONZE: { label: "Bronze", detail: "Verified foundation tier" },
  SILVER: { label: "Silver", detail: "Consistent payment history" },
  GOLD: { label: "Gold", detail: "High buyer confidence" },
  PLATINUM: { label: "Platinum", detail: "Top reputation tier" },
};

const tierImageMap: Record<VendorTier, string> = {
  BRONZE: "/images/bronze.png",
  SILVER: "/images/silver.png",
  GOLD: "/images/gold.png",
  PLATINUM: "/images/platinum.png",
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

const socialImageMap: Partial<Record<SocialPlatform, string>> = {
  FACEBOOK: "/images/facebook.png",
  TWITTER: "/images/x.png",
  LINKEDIN: "/images/linkedin.png",
  WHATSAPP: "/images/whatsapp.png",
  TIKTOK: "/images/tiktok.png",
  YOUTUBE: "/images/youtube.png",
};

export function VendorTrustPanel({ vendor }: VendorTrustPanelProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="vp-card p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="grid h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-canvas-border bg-canvas-surface">
            <img
              src={vendor.business.logo}
              alt={`${vendor.business.name} logo`}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.14em] text-chartwell-blue uppercase">
              VendorProof Trust Badge
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h1 className="vp-headline text-2xl sm:text-3xl">
                {vendor.business.name}
              </h1>
              {vendor.business.kycStatus === "VERIFIED" ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-[#86efac] bg-[#dcfce7] px-2.5 py-1 text-[11px] font-semibold text-[#166534] dark:border-[#3f7f57] dark:bg-[#143521] dark:text-[#86efac]">
                  <CheckBadgeIcon className="h-3.5 w-3.5" />
                  Verified
                </span>
              ) : null}
            </div>
            <p className="vp-muted mt-1 text-sm leading-6">
              {vendor.ownerName} · {vendor.category}
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-canvas-border px-3 py-1 text-xs font-medium text-ash-gray dark:text-slate-300">
          <CheckBadgeIcon className="h-4 w-4" />
          {vendor.business.kycStatus}
        </div>
      </div>

      <p className="vp-muted mt-5 max-w-2xl text-sm leading-6">
        {vendor.business.description}
      </p>

      {vendor.serviceInfo ? (
        <div className="mt-4 inline-flex rounded-full border border-canvas-border px-3 py-1 text-xs font-medium text-ash-gray dark:text-slate-300">
          Service: {vendor.serviceInfo}
        </div>
      ) : null}

      {vendor.socials.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {vendor.socials.map((social) => (
            <a
              key={`${social.platform}-${social.url}`}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-canvas-border px-3 py-1 text-xs font-medium text-ash-gray transition hover:-translate-y-0.5 hover:border-hover-stone hover:text-slate-text dark:text-slate-300"
            >
              {social.platform === "WEBSITE" ? (
                <LinkIcon className="h-3.5 w-3.5" />
              ) : socialImageMap[social.platform] ? (
                <Image
                  src={socialImageMap[social.platform] as string}
                  alt={`${socialLabelMap[social.platform]} logo`}
                  width={14}
                  height={14}
                  className="h-3.5 w-3.5 rounded-sm object-cover"
                />
              ) : (
                <span className="inline-flex h-3.5 min-w-3.5 items-center justify-center rounded-sm border border-stone-border px-0.5 text-[9px] font-semibold leading-none uppercase">
                  {socialLabelMap[social.platform].slice(0, 2)}
                </span>
              )}
              {socialLabelMap[social.platform]}
            </a>
          ))}

          <Link
            href={`/vendor/${vendor.business.slug}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-canvas-border px-3 py-1 text-xs font-semibold text-slate-text transition hover:-translate-y-0.5 hover:border-hover-stone dark:text-slate-100"
          >
            <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
            View Profile
          </Link>
        </div>
      ) : null}

      {vendor.business.showcaseImages.length > 0 ? (
        <div className="mt-6">
          <p className="text-xs font-semibold tracking-[0.1em] text-slate-text uppercase dark:text-slate-300">
            Business Showcase
          </p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {vendor.business.showcaseImages.slice(0, 3).map((imageUrl) => (
              <div
                key={imageUrl}
                className="h-24 overflow-hidden rounded-xl border border-canvas-border bg-canvas-surface"
              >
                <img
                  src={imageUrl}
                  alt={`${vendor.business.name} showcase`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-[280px_1fr]">
        <TrustScoreGauge
          score={vendor.business.trustScore}
          histories={vendor.business.trustScoreHistories}
        />

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${tierStyles[vendor.business.tier.name]}`}
            >
              <Image
                src={tierImageMap[vendor.business.tier.name]}
                alt={`${tierCopy[vendor.business.tier.name].label} tier icon`}
                width={18}
                height={18}
                className="h-[18px] w-[18px]"
              />
              {tierCopy[vendor.business.tier.name].label} Tier
            </div>
          </div>
          <p className="vp-muted -mt-2 text-xs">
            {tierCopy[vendor.business.tier.name].detail}
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard
              icon={UserGroupIcon}
              label="Verified Buyers"
              value={vendor.totalVerifiedBuyers.toLocaleString("en-NG")}
            />
            <MetricCard
              icon={ArrowTrendingUpIcon}
              label="Trust Growth"
              value={vendor.trustGrowth}
            />
            <MetricCard
              icon={CheckBadgeIcon}
              label="Successful Transactions"
              value={vendor.successfulTransactionsCount.toLocaleString("en-NG")}
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}

type MetricCardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: string;
};

function MetricCard({ icon: Icon, label, value }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-canvas-border bg-canvas-surface p-4">
      <p className="vp-muted inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.08em] uppercase">
        <Icon className="h-4 w-4" />
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-text dark:text-slate-100">
        {value}
      </p>
    </div>
  );
}
