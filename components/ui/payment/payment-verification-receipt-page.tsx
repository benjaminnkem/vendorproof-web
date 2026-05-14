"use client";

import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import html2canvas from "html2canvas";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import type {
  PaymentVerificationReceiptData,
  PaymentVerificationStatus,
} from "@/lib/service/payment-verification.service";
import type { VendorTier } from "@/lib/service/payment.service";

type PaymentVerificationReceiptPageProps = {
  receipt: PaymentVerificationReceiptData;
};

const tierImageMap: Record<VendorTier, string> = {
  BRONZE: "/images/bronze.png",
  SILVER: "/images/silver.png",
  GOLD: "/images/gold.png",
  PLATINUM: "/images/platinum.png",
};

function formatNaira(value: number | null): string {
  if (typeof value !== "number") {
    return "N/A";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function getStatusText(status: PaymentVerificationStatus): string {
  if (status === "COMPLETED") {
    return "Payment Verified";
  }

  return "Payment Pending";
}

export function PaymentVerificationReceiptPage({
  receipt,
}: PaymentVerificationReceiptPageProps) {
  const receiptRef = useRef<HTMLDivElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fileName = useMemo(() => {
    const reference =
      receipt.transactionReference?.trim() || receipt.reference.trim();
    return `vendorproof-receipt-${reference}.png`;
  }, [receipt.reference, receipt.transactionReference]);

  async function renderReceiptBlob(): Promise<Blob> {
    if (!receiptRef.current) {
      throw new Error("Receipt card is not ready yet.");
    }

    const canvas = await html2canvas(receiptRef.current, {
      backgroundColor: "#0d1120",
      scale: Math.min(window.devicePixelRatio || 2, 3),
      useCORS: true,
      logging: false,
    });

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((value) => resolve(value), "image/png", 1);
    });

    if (!blob) {
      throw new Error("Could not create receipt image.");
    }

    return blob;
  }

  async function downloadReceiptImage() {
    setActionMessage(null);
    setIsExporting(true);

    try {
      const blob = await renderReceiptBlob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
      setActionMessage("Receipt image downloaded.");
    } catch (error) {
      setActionMessage(
        error instanceof Error
          ? error.message
          : "Unable to download the receipt image.",
      );
    } finally {
      setIsExporting(false);
    }
  }

  async function shareReceiptImage() {
    setActionMessage(null);
    setIsExporting(true);

    try {
      const blob = await renderReceiptBlob();
      const file = new File([blob], fileName, { type: "image/png" });

      if (
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: "VendorProof Payment Receipt",
          text: `Payment receipt for ${
            receipt.business?.name ?? "Vendor"
          } (${receipt.transactionReference ?? receipt.reference})`,
          files: [file],
        });
        setActionMessage("Receipt image shared.");
        return;
      }

      await downloadReceiptImage();
      setActionMessage(
        "Sharing not supported on this browser. Image downloaded.",
      );
    } catch (error) {
      setActionMessage(
        error instanceof Error
          ? error.message
          : "Unable to share the receipt image.",
      );
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="vp-ambient-grid vp-page">
      <motion.header
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="vp-shell mb-5"
      >
        <p className="vp-kicker text-chartwell-blue">Payment Verification</p>
        <h1 className="vp-headline mt-2 text-3xl sm:text-4xl">
          {getStatusText(receipt.status)}
        </h1>
        <p className="vp-muted mt-2 max-w-2xl text-sm">{receipt.message}</p>
      </motion.header>

      <main className="vp-shell grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start lg:gap-5">
        <motion.section
          ref={receiptRef}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="vp-card p-6"
        >
          <div className="flex items-start justify-between gap-3 border-b border-canvas-border pb-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.12em] text-chartwell-blue uppercase">
                VendorProof Receipt
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-text">
                {receipt.transactionReference ?? receipt.reference}
              </p>
            </div>
            <span className="inline-flex rounded-full border border-canvas-border px-3 py-1 text-xs font-semibold text-slate-text">
              {receipt.status}
            </span>
          </div>

          <div className="mt-5 grid gap-3 rounded-xl border border-canvas-border bg-canvas-elevated p-4">
            <Row label="Buyer name" value={receipt.buyerName ?? "N/A"} />
            <Row label="Buyer email" value={receipt.buyerEmail ?? "N/A"} />
            <Row label="Amount" value={formatNaira(receipt.amount)} />
            <Row
              label="Transaction reference"
              value={receipt.transactionReference ?? receipt.reference}
            />
            <Row label="Business" value={receipt.business?.name ?? "N/A"} />
            <Row
              label="Trust score"
              value={
                receipt.business
                  ? receipt.business.trustScore.toFixed(1)
                  : "N/A"
              }
            />
          </div>

          <div className="mt-4 rounded-xl border border-canvas-border bg-canvas-elevated p-4">
            <p className="text-xs font-semibold tracking-[0.1em] text-slate-text uppercase">
              Business Tier
            </p>
            {receipt.business?.tier ? (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-canvas-border px-3 py-1.5">
                <img
                  src={tierImageMap[receipt.business.tier.name]}
                  alt={`${receipt.business.tier.name} tier icon`}
                  className="h-5 w-5 rounded-sm object-cover"
                  loading="lazy"
                />
                <span className="text-sm font-semibold text-slate-text">
                  {receipt.business.tier.name}
                </span>
              </div>
            ) : (
              <p className="vp-muted mt-2 text-sm">N/A</p>
            )}
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.04 }}
          className="vp-card p-5"
        >
          <p className="text-sm font-semibold">Receipt Actions</p>
          <p className="vp-muted mt-1 text-xs">
            Save or share your receipt image for your records.
          </p>

          <div className="mt-4 grid gap-2">
            <button
              type="button"
              onClick={downloadReceiptImage}
              disabled={isExporting}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-chartwell-blue px-4 py-2.5 text-sm font-semibold text-cloud-white transition hover:-translate-y-0.5 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Download Image
            </button>

            <button
              type="button"
              onClick={shareReceiptImage}
              disabled={isExporting}
              className="inline-flex items-center justify-center gap-1.5 rounded-full border border-canvas-border px-4 py-2.5 text-sm font-semibold text-slate-text transition hover:-translate-y-0.5 hover:border-hover-stone disabled:cursor-not-allowed disabled:opacity-70"
            >
              <ShareIcon className="h-4 w-4" />
              Share Image
            </button>
          </div>

          {receipt.business ? (
            <Link
              href={`/vendor/${receipt.business.slug}`}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-chartwell-blue"
            >
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              View Business Profile
            </Link>
          ) : null}

          {actionMessage ? (
            <p className="vp-muted mt-3 text-xs">{actionMessage}</p>
          ) : null}
        </motion.aside>
      </main>
    </div>
  );
}

type RowProps = {
  label: string;
  value: string;
};

function Row({ label, value }: RowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-canvas-border pb-2 text-sm last:border-b-0 last:pb-0">
      <span className="vp-muted">{label}</span>
      <span className="vp-stat-value text-right font-semibold text-slate-text">
        {value}
      </span>
    </div>
  );
}
