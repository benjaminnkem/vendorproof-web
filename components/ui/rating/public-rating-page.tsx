"use client";

import {
  ChatBubbleLeftEllipsisIcon,
  CheckCircleIcon,
  StarIcon as StarIconOutline,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  submitPublicRatingByToken,
  type PublicRatingPageData,
} from "@/lib/service/rating.service";

type PublicRatingPageProps = {
  ratingToken: string;
  payment: PublicRatingPageData;
};

const ratingLabels = ["Very poor", "Poor", "Good", "Very good", "Excellent"];

function formatNaira(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PublicRatingPage({
  ratingToken,
  payment,
}: PublicRatingPageProps) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [updatedTrustScore, setUpdatedTrustScore] = useState<number | null>(
    null,
  );
  const feedbackRef = useRef<HTMLTextAreaElement | null>(null);

  const submitRatingMutation = useMutation({
    mutationFn: () =>
      submitPublicRatingByToken(ratingToken, {
        rating,
        ...(feedback.trim().length > 0 ? { comment: feedback.trim() } : {}),
      }),
    onSuccess: (result) => {
      setSubmitMessage(result.message);
      setUpdatedTrustScore(result.newTrustScore);
      setIsSubmitted(true);
    },
  });

  function onFeedbackChange(value: string) {
    setFeedback(value);
    const element = feedbackRef.current;
    if (!element) {
      return;
    }
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating < 1 || submitRatingMutation.isPending) {
      return;
    }

    await submitRatingMutation.mutateAsync();
  }

  function getErrorMessage() {
    const mutationError = submitRatingMutation.error;

    if (!mutationError) {
      return null;
    }

    if (mutationError instanceof AxiosError) {
      const apiMessage = mutationError.response?.data?.message;
      if (typeof apiMessage === "string" && apiMessage.trim().length > 0) {
        return apiMessage;
      }
    }

    if (mutationError instanceof Error) {
      return mutationError.message;
    }

    return "Unable to submit your rating right now. Please try again.";
  }

  const errorMessage = getErrorMessage();

  return (
    <div className="vp-ambient-grid vp-page">
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        className="vp-shell mb-5"
      >
        <p className="vp-kicker text-chartwell-blue">VendorProof Rating</p>
        <h1 className="vp-headline mt-2 text-3xl sm:text-4xl">
          Share your experience
        </h1>
        <p className="vp-muted mt-2 max-w-2xl text-sm">
          Rate this completed payment in a few seconds.
        </p>
      </motion.header>

      <main className="vp-shell grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:gap-5">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="vp-card p-6"
        >
          <p className="text-[11px] font-semibold tracking-[0.14em] text-chartwell-blue uppercase">
            Payment Summary
          </p>

          <div className="mt-4 flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-canvas-border bg-canvas-surface">
              <img
                src={payment.business.logo}
                alt={`${payment.business.name} logo`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            <div>
              <h2 className="vp-headline text-2xl">{payment.business.name}</h2>
              <p className="vp-muted mt-1 text-sm">
                Trust score:{" "}
                {(updatedTrustScore ?? payment.business.trustScore).toFixed(1)}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-2 rounded-xl border border-canvas-border bg-canvas-elevated p-4">
            <SummaryRow label="Payment ID" value={`#${payment.paymentId}`} />
            <SummaryRow label="Buyer" value={payment.buyerName} />
            <SummaryRow label="Amount" value={formatNaira(payment.amount)} />
          </div>

          <Link
            href={`/vendor/${payment.business.slug}`}
            className="mt-5 inline-flex rounded-full border border-canvas-border px-3 py-1.5 text-xs font-semibold text-slate-text transition hover:-translate-y-0.5 hover:border-hover-stone"
          >
            View vendor profile
          </Link>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
          className="vp-card p-6"
        >
          {!isSubmitted ? (
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <p className="text-sm font-semibold">
                  How would you rate this vendor?
                </p>
                <div
                  className="mt-3 flex items-center gap-1"
                  role="radiogroup"
                  aria-label="Select a rating"
                  onKeyDown={(event) => {
                    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
                      event.preventDefault();
                      setRating((value) => Math.min(5, value + 1));
                    }
                    if (
                      event.key === "ArrowLeft" ||
                      event.key === "ArrowDown"
                    ) {
                      event.preventDefault();
                      setRating((value) => Math.max(1, value - 1));
                    }
                  }}
                >
                  {[1, 2, 3, 4, 5].map((value) => {
                    const selected = value <= rating;

                    return (
                      <motion.button
                        key={value}
                        type="button"
                        role="radio"
                        aria-checked={rating === value}
                        tabIndex={
                          rating === value || (rating === 0 && value === 1)
                            ? 0
                            : -1
                        }
                        onClick={() => setRating(value)}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.97 }}
                        className={`rounded-lg p-1.5 transition ${
                          rating === value
                            ? "bg-sky-tint/40"
                            : "hover:bg-canvas-border"
                        }`}
                        aria-label={`Rate ${value} out of 5: ${ratingLabels[value - 1]}`}
                      >
                        {selected ? (
                          <StarIconSolid className="h-8 w-8 text-chartwell-blue" />
                        ) : (
                          <StarIconOutline className="h-8 w-8 text-slate-400" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                <p className="vp-muted mt-1 text-xs">
                  {rating > 0
                    ? `Selected: ${rating}/5 (${ratingLabels[rating - 1]})`
                    : "Tap a star to rate."}
                </p>
              </div>

              <div>
                <label
                  htmlFor="feedback"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.08em] uppercase vp-muted"
                >
                  <ChatBubbleLeftEllipsisIcon className="h-4 w-4" />
                  Feedback
                </label>
                <textarea
                  ref={feedbackRef}
                  id="feedback"
                  rows={3}
                  value={feedback}
                  onChange={(event) => onFeedbackChange(event.target.value)}
                  placeholder="Tell us briefly how the payment experience went."
                  className="mt-2 w-full resize-none rounded-lg border border-canvas-border bg-canvas-surface px-4 py-3 text-sm outline-none transition focus:border-chartwell-blue focus:ring-2 focus:ring-sky-tint"
                />
              </div>

              <button
                type="submit"
                disabled={rating < 1 || submitRatingMutation.isPending}
                className="inline-flex w-full items-center justify-center rounded-full bg-chartwell-blue px-5 py-3 text-sm font-semibold text-cloud-white transition hover:-translate-y-0.5 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitRatingMutation.isPending
                  ? "Submitting rating..."
                  : "Submit rating"}
              </button>

              {errorMessage ? (
                <p className="text-xs text-rose-300">{errorMessage}</p>
              ) : null}
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.26, ease: "easeOut" }}
              className="rounded-xl border border-canvas-border bg-canvas-elevated p-5"
            >
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-chartwell-blue">
                <CheckCircleIcon className="h-5 w-5" />
                Rating submitted
              </p>
              <p className="vp-muted mt-2 text-sm">
                {submitMessage ||
                  `Thanks, ${payment.buyerName}. You rated this payment ${rating}/5.`}
              </p>
              {feedback.trim() ? (
                <p className="mt-3 rounded-lg border border-canvas-border bg-canvas-surface px-3 py-2 text-sm text-slate-text">
                  {feedback.trim()}
                </p>
              ) : null}
            </motion.div>
          )}
        </motion.section>
      </main>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: string;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="vp-muted">{label}</span>
      <span className="vp-stat-value font-semibold text-slate-text">
        {value}
      </span>
    </div>
  );
}
