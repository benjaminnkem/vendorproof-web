"use client";

import {
  ArrowTopRightOnSquareIcon,
  BanknotesIcon,
  ChatBubbleLeftEllipsisIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  StarIcon as StarIconOutline,
  UserIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import type { ComponentType, ReactNode, SVGProps } from "react";
import {
  initiatePaymentByToken,
  submitRatingByToken,
  type PublicPaymentPageData,
} from "@/lib/service/payment.service";

type BuyerPaymentFormProps = {
  vendor: PublicPaymentPageData;
};

type PaymentFormValues = {
  buyersName: string;
  buyersEmail: string;
  amountInput: string;
  serviceRendered: boolean;
  rating: number;
  feedback: string;
};

function parseAmount(value: string): number {
  const clean = value.replace(/[^0-9]/g, "");
  return clean ? Number(clean) : 0;
}

function formatNaira(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

export function BuyerPaymentForm({ vendor }: BuyerPaymentFormProps) {
  const form = useForm<PaymentFormValues>({
    defaultValues: {
      buyersName: "",
      buyersEmail: "",
      serviceRendered: false,
      rating: 0,
      feedback: "",
      amountInput:
        vendor.linkMode === "fixed" && vendor.fixedAmount
          ? vendor.fixedAmount.toString()
          : vendor.suggestedAmount
            ? vendor.suggestedAmount.toString()
            : "",
    },
  });

  const feedbackRef = useRef<HTMLTextAreaElement | null>(null);

  const amountInput = form.watch("amountInput");
  const serviceRendered = form.watch("serviceRendered");
  const rating = form.watch("rating");
  const feedback = form.watch("feedback");

  const amountValue = useMemo(() => parseAmount(amountInput), [amountInput]);
  const formattedAmount = amountValue > 0 ? formatNaira(amountValue) : "";

  const ratingLabels = ["Very poor", "Poor", "Good", "Very good", "Excellent"];

  const initiatePaymentMutation = useMutation({
    mutationFn: async (values: PaymentFormValues) => {
      const paymentResult = await initiatePaymentByToken(vendor.paymentToken, {
        buyerName: values.buyersName,
        buyerEmail: values.buyersEmail,
        ...(values.amountInput.trim().length > 0
          ? { amount: parseAmount(values.amountInput).toString() }
          : {}),
        isServiceRendered: values.serviceRendered,
        rating: values.rating,
        feedback: values.feedback,
      });

      if (values.serviceRendered && paymentResult.ratingToken) {
        if (values.rating < 1 || values.rating > 5) {
          throw new Error(
            "Please select a rating before continuing with delivered-service payment.",
          );
        }
      }

      return paymentResult;
    },
    onSuccess: (result) => {
      window.location.assign(result.checkoutUrl);
    },
  });

  function getErrorMessage() {
    const mutationError = initiatePaymentMutation.error;

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

    return "Unable to initiate payment right now. Please try again.";
  }

  function onBlurAmount() {
    if (vendor.linkMode === "fixed") {
      return;
    }

    if (!amountValue) {
      form.setValue("amountInput", "");
      return;
    }

    form.setValue(
      "amountInput",
      new Intl.NumberFormat("en-NG").format(amountValue),
    );
  }

  function onFeedbackChange(value: string) {
    form.setValue("feedback", value);
    const element = feedbackRef.current;
    if (!element) {
      return;
    }
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }

  async function onSubmit(values: PaymentFormValues) {
    if (vendor.linkMode !== "fixed" && parseAmount(values.amountInput) <= 0) {
      form.setError("amountInput", {
        type: "manual",
        message: "Amount is required for this payment link.",
      });
      return;
    }

    form.clearErrors("amountInput");
    await initiatePaymentMutation.mutateAsync(values);
  }

  const errorMessage = getErrorMessage();

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
      className="vp-card p-6"
    >
      <h2 className="vp-headline text-2xl tracking-tight">
        Continue to Secure Payment
      </h2>
      <p className="vp-muted mt-1 text-sm">
        Payment is processed through Squad Checkout. No card details are
        collected on this page.
      </p>

      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <LabeledField label="Buyer Name" htmlFor="buyersName" icon={UserIcon}>
          <input
            id="buyersName"
            required
            {...form.register("buyersName", {
              required: "Buyer name is required.",
            })}
            className="h-11 w-full rounded-lg border border-canvas-border bg-canvas-surface px-10 text-sm outline-none transition focus:border-chartwell-blue focus:ring-2 focus:ring-sky-tint"
            placeholder="Enter your full name"
          />
        </LabeledField>

        <LabeledField
          label="Buyer Email"
          htmlFor="buyersEmail"
          icon={EnvelopeIcon}
        >
          <input
            id="buyersEmail"
            type="email"
            required
            {...form.register("buyersEmail", {
              required: "Buyer email is required.",
            })}
            className="h-11 w-full rounded-lg border border-canvas-border bg-canvas-surface px-10 text-sm outline-none transition focus:border-chartwell-blue focus:ring-2 focus:ring-sky-tint"
            placeholder="you@example.com"
          />
        </LabeledField>

        <LabeledField
          label={
            vendor.linkMode === "fixed"
              ? "Amount (Locked)"
              : "Amount (Optional)"
          }
          htmlFor="paymentAmount"
          icon={BanknotesIcon}
        >
          <input
            id="paymentAmount"
            name="paymentAmount"
            value={vendor.linkMode === "fixed" ? formattedAmount : amountInput}
            onChange={(event) =>
              form.setValue("amountInput", event.target.value)
            }
            onBlur={onBlurAmount}
            readOnly={vendor.linkMode === "fixed"}
            className="h-11 w-full rounded-lg border border-canvas-border bg-canvas-surface px-10 text-sm outline-none transition focus:border-chartwell-blue focus:ring-2 focus:ring-sky-tint read-only:cursor-not-allowed read-only:bg-canvas-fog"
            placeholder="Enter amount in naira"
          />
        </LabeledField>

        {form.formState.errors.amountInput?.message ? (
          <p className="-mt-3 text-xs text-rose-300">
            {form.formState.errors.amountInput.message}
          </p>
        ) : null}

        <div className="rounded-xl border border-canvas-border bg-canvas-elevated p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">
                Has this service/product already been delivered?
              </p>
              <p className="vp-muted text-xs">
                Enable this to leave a quick rating that strengthens vendor
                reputation signals.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={serviceRendered}
              onClick={() =>
                form.setValue("serviceRendered", !serviceRendered, {
                  shouldDirty: true,
                  shouldTouch: true,
                })
              }
              className={`relative inline-flex h-7 w-12 items-center rounded-full p-1 transition ${
                serviceRendered ? "bg-chartwell-blue" : "bg-slate-300"
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full bg-white shadow transition ${
                  serviceRendered ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <p className="mt-2 text-xs font-semibold text-chartwell-blue">
            {serviceRendered ? "Yes, service delivered" : "No, paying upfront"}
          </p>
        </div>

        <AnimatePresence initial={false}>
          {serviceRendered ? (
            <motion.div
              key="rating"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="space-y-4 rounded-xl border border-canvas-border bg-canvas-elevated p-4">
                <div>
                  <p className="text-sm font-semibold">Rate your experience</p>
                  <div
                    className="mt-3 flex items-center gap-1"
                    role="radiogroup"
                    aria-label="Rate your experience"
                    onKeyDown={(event) => {
                      if (
                        event.key === "ArrowRight" ||
                        event.key === "ArrowUp"
                      ) {
                        event.preventDefault();
                        form.setValue("rating", Math.min(5, rating + 1));
                      }
                      if (
                        event.key === "ArrowLeft" ||
                        event.key === "ArrowDown"
                      ) {
                        event.preventDefault();
                        form.setValue("rating", Math.max(1, rating - 1));
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
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => form.setValue("rating", value)}
                          className={`rounded-lg p-1.5 transition ${
                            rating === value
                              ? "bg-sky-tint/40"
                              : "hover:bg-canvas-border"
                          }`}
                          aria-label={`Rate ${value} out of 5: ${ratingLabels[value - 1]}`}
                        >
                          {selected ? (
                            <StarIconSolid className="h-7 w-7 text-chartwell-blue" />
                          ) : (
                            <StarIconOutline className="h-7 w-7 text-slate-400" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="feedback"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.1em] uppercase vp-muted"
                  >
                    <ChatBubbleLeftEllipsisIcon className="h-4 w-4" />
                    Optional feedback
                  </label>
                  <textarea
                    ref={feedbackRef}
                    id="feedback"
                    rows={2}
                    value={feedback}
                    onChange={(event) => onFeedbackChange(event.target.value)}
                    placeholder="How was your experience with this vendor?"
                    className="mt-2 w-full resize-none rounded-lg border border-canvas-border bg-canvas-surface px-4 py-3 text-sm outline-none transition focus:border-chartwell-blue focus:ring-2 focus:ring-sky-tint"
                  />
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="sticky bottom-4">
          {errorMessage ? (
            <p className="mb-2 text-xs text-rose-300">{errorMessage}</p>
          ) : null}

          <button
            type="submit"
            disabled={initiatePaymentMutation.isPending}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-chartwell-blue px-5 py-3 text-sm font-semibold text-cloud-white transition hover:-translate-y-0.5 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {!initiatePaymentMutation.isPending ? (
              <ArrowTopRightOnSquareIcon className="h-4 w-4" />
            ) : null}
            {initiatePaymentMutation.isPending
              ? "Redirecting to secure checkout..."
              : "Continue to Secure Payment"}
          </button>
          <p className="mt-2 inline-flex w-full items-center justify-center gap-1.5 text-center text-xs vp-muted">
            <ShieldCheckIcon className="h-4 w-4" />
            Protected checkout powered by Squad.
          </p>
        </div>
      </form>
    </motion.section>
  );
}

type LabeledFieldProps = {
  label: string;
  htmlFor: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  children: ReactNode;
};

function LabeledField({
  label,
  htmlFor,
  icon: Icon,
  children,
}: LabeledFieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={htmlFor}
        className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.08em] uppercase vp-muted"
      >
        <Icon className="h-4 w-4" />
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-steel-gray dark:text-slate-500" />
        {children}
      </div>
    </div>
  );
}
