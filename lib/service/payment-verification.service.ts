import { AxiosError } from "axios";
import httpInstance from "@/lib/config/http.config";
import type { VendorTier } from "./payment.service";

export type PaymentVerificationStatus = "COMPLETED" | "PENDING";

export type PaymentVerificationReceiptData = {
  reference: string;
  status: PaymentVerificationStatus;
  message: string;
  amount: number | null;
  buyerName: string | null;
  buyerEmail: string | null;
  transactionReference: string | null;
  ratingToken: string | null;
  business: {
    name: string;
    slug: string;
    logo: string | null;
    trustScore: number;
    tier: {
      name: VendorTier;
    } | null;
  } | null;
};

type VerifyPaymentSuccessResponse = {
  status: string;
  statusCode: number;
  data: {
    status: PaymentVerificationStatus;
    message: string;
    business: {
      name: string;
      slug: string;
      logo: string | null;
      tier: {
        name: string;
      } | null;
      trustScore: number;
    } | null;
    ratingToken: string | null;
    amount: number | null;
    buyerName: string | null;
    buyerEmail: string | null;
    transactionReference: string | null;
  };
};

const TIER_VALUES: VendorTier[] = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];

function normalizeTier(value: string | undefined): VendorTier {
  const normalized = (value ?? "").toUpperCase() as VendorTier;
  return TIER_VALUES.includes(normalized) ? normalized : "BRONZE";
}

export async function getPaymentVerificationByReference(
  reference: string,
): Promise<PaymentVerificationReceiptData | null> {
  try {
    const response = await httpInstance.get<VerifyPaymentSuccessResponse>(
      `/pay/verify/${reference}`,
    );

    return {
      reference,
      status: response.data.data.status,
      message: response.data.data.message,
      amount: response.data.data.amount,
      buyerName: response.data.data.buyerName,
      buyerEmail: response.data.data.buyerEmail,
      transactionReference: response.data.data.transactionReference,
      ratingToken: response.data.data.ratingToken,
      business: response.data.data.business
        ? {
            name: response.data.data.business.name,
            slug: response.data.data.business.slug,
            logo: response.data.data.business.logo,
            trustScore: Number(response.data.data.business.trustScore) || 0,
            tier: response.data.data.business.tier
              ? { name: normalizeTier(response.data.data.business.tier.name) }
              : null,
          }
        : null,
    };
  } catch (error) {
    if (
      error instanceof AxiosError &&
      (error.response?.status === 404 || error.response?.status === 400)
    ) {
      return null;
    }

    throw error;
  }
}
