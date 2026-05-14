"use client";

import { motion } from "framer-motion";
import Lenis from "lenis";
import { useEffect } from "react";
import type { PublicPaymentPageData } from "@/lib/service/payment.service";
import { BuyerPaymentForm } from "./buyer-payment-form";
import { VendorTrustPanel } from "./vendor-trust-panel";

type PublicPaymentPageProps = {
  vendor: PublicPaymentPageData;
};

export function PublicPaymentPage({ vendor }: PublicPaymentPageProps) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.9,
      smoothWheel: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };

    rafId = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="vp-ambient-grid vp-page">
      <motion.header
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="vp-shell mb-5 flex items-end justify-between"
      >
        <div>
          <p className="vp-kicker text-chartwell-blue">VendorProof Payment</p>
          <h1 className="vp-headline mt-2 text-3xl sm:text-4xl">
            Pay with confidence, backed by public trust signals.
          </h1>
          <p className="vp-muted mt-2 max-w-2xl text-sm">
            Identity first, payment second. Review vendor credibility before you
            continue to Squad checkout.
          </p>
        </div>
      </motion.header>

      <main className="vp-shell grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:gap-5">
        <VendorTrustPanel vendor={vendor} />
        <BuyerPaymentForm vendor={vendor} />
      </main>
    </div>
  );
}
