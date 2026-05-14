import { AxiosError } from "axios";
import httpInstance from "@/lib/config/http.config";

export type VendorTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";
export type PaymentLinkMode = "generic" | "fixed";

export type SocialPlatform =
  | "FACEBOOK"
  | "TWITTER"
  | "LINKEDIN"
  | "INSTAGRAM"
  | "WHATSAPP"
  | "TIKTOK"
  | "YOUTUBE"
  | "WEBSITE"
  | "OTHER";

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
};

export type TrustScoreHistory = {
  score: number;
  createdAt: string;
};

export type VendorMetric = {
  label: string;
  value: string;
  trend: string;
};

export type PublicPaymentPageData = {
  paymentToken: string;
  business: {
    name: string;
    description: string;
    logo: string;
    showcaseImages: string[];
    slug: string;
    trustScore: number;
    kycStatus: "VERIFIED" | "PENDING";
    tier: {
      name: VendorTier;
    };
    trustScoreHistories: TrustScoreHistory[];
  };
  socials: SocialLink[];
  ownerName: string;
  businessPhoneNumber: string;
  alternativePhoneNumber?: string;
  category: string;
  totalAmountTransacted: number;
  ratingSummary: number;
  ratingCount: number;
  reviews: Array<{
    reviewerName?: string;
    rating: number;
    comment?: string;
    createdAt: string;
  }>;
  serviceInfo?: string;
  totalVerifiedBuyers: number;
  trustGrowth: string;
  successfulTransactionsCount: number;
  linkMode: PaymentLinkMode;
  fixedAmount?: number;
  suggestedAmount?: number;
};

type GetPaymentPageSuccessResponse = {
  status: string;
  statusCode: number;
  data: {
    business: {
      name: string;
      description: string | null;
      logo: string | null;
      slug: string;
      trustScore: number;
      kycStatus: string;
      phoneNumber: string | null;
      alternativePhoneNumber: string | null;
      category: string | null;
      showCaseImages: string[];
      socials: Array<{
        platform: string;
        url: string;
      }>;
      tier: {
        name: string;
      } | null;
      owner: {
        firstName: string;
        lastName: string;
      } | null;
      trustScoreHistories: Array<{
        score: number;
        createdAt: string;
      }>;
      ratingsSummary: number | null;
      ratingsCount: number;
      reviews: Array<{
        reviewerName?: string;
        rating: number;
        comment?: string | null;
        createdAt: string;
      }>;
      totalAmountTransacted: number;
      successfulTransactionsCount: number;
      totalVerifiedBuyers: number;
      trustGrowth: string;
    };
    paymentLink: {
      type: "GENERIC" | "SERVICE" | "QUICK";
      amount: number | null;
      description: string | null;
      isOneTime: boolean;
    };
  };
};

type InitiatePaymentRequest = {
  buyerName: string;
  buyerEmail: string;
  amount?: string | number;
  isServiceRendered: boolean;
  rating?: number;
  feedback?: string;
};

type InitiatePaymentSuccessResponse = {
  status: string;
  statusCode: number;
  data: {
    paymentId: number;
    amount: number;
    isServiceRendered: boolean;
    ratingToken: string | null;
    message: string;
    checkoutUrl: string;
  } & Record<string, unknown>;
};

export type InitiatePaymentInput = {
  buyerName: string;
  buyerEmail: string;
  amount?: string;
  isServiceRendered: boolean;
  rating?: number;
  feedback?: string;
};

export type InitiatePaymentResult = {
  paymentId: number;
  amount: number;
  ratingToken: string | null;
  message: string;
  checkoutUrl: string;
};

type SubmitRatingRequest = {
  rating: number;
  comment?: string;
};

type SubmitRatingSuccessResponse = {
  status: string;
  statusCode: number;
  data: {
    message: string;
    newTrustScore: number;
  };
};

export type SubmitRatingInput = {
  rating: number;
  comment?: string;
};

const TIER_VALUES: VendorTier[] = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];
const SOCIAL_VALUES: SocialPlatform[] = [
  "FACEBOOK",
  "TWITTER",
  "LINKEDIN",
  "INSTAGRAM",
  "WHATSAPP",
  "TIKTOK",
  "YOUTUBE",
  "WEBSITE",
  "OTHER",
];

function normalizeTier(value: string | null | undefined): VendorTier {
  const normalized = (value ?? "").toUpperCase();
  return TIER_VALUES.includes(normalized as VendorTier)
    ? (normalized as VendorTier)
    : "BRONZE";
}

function normalizeKycStatus(
  value: string | null | undefined,
): "VERIFIED" | "PENDING" {
  return (value ?? "").toUpperCase() === "VERIFIED" ? "VERIFIED" : "PENDING";
}

function normalizePlatform(value: string): SocialPlatform {
  const normalized = value.toUpperCase() as SocialPlatform;
  return SOCIAL_VALUES.includes(normalized) ? normalized : "OTHER";
}

export function mapPaymentPageResponseToViewData(
  token: string,
  payload: GetPaymentPageSuccessResponse["data"],
): PublicPaymentPageData {
  const trustScore = Number(payload.business.trustScore) || 0;
  const trustHistories =
    payload.business.trustScoreHistories?.length > 0
      ? payload.business.trustScoreHistories
      : [{ score: trustScore, createdAt: new Date().toISOString() }];

  const isFixedAmount = typeof payload.paymentLink.amount === "number";
  const fixedAmount = isFixedAmount
    ? (payload.paymentLink.amount ?? undefined)
    : undefined;

  const ownerName = payload.business.owner
    ? `${payload.business.owner.firstName} ${payload.business.owner.lastName}`.trim()
    : "Not available";

  const socials: SocialLink[] =
    payload.business.socials?.map((social) => ({
      platform: normalizePlatform(social.platform),
      url: social.url,
    })) ?? [];

  return {
    paymentToken: token,
    business: {
      name: payload.business.name,
      description:
        payload.business.description ??
        "No business description available yet.",
      logo: payload.business.logo ?? "/images/vendor-placeholder.png",
      showcaseImages: payload.business.showCaseImages ?? [],
      slug: payload.business.slug,
      trustScore,
      kycStatus: normalizeKycStatus(payload.business.kycStatus),
      tier: {
        name: normalizeTier(payload.business.tier?.name),
      },
      trustScoreHistories: trustHistories,
    },
    socials,
    ownerName,
    businessPhoneNumber: payload.business.phoneNumber ?? "Not available",
    alternativePhoneNumber:
      payload.business.alternativePhoneNumber ?? undefined,
    category: payload.business.category ?? "Uncategorized",
    totalAmountTransacted: payload.business.totalAmountTransacted ?? 0,
    ratingSummary: payload.business.ratingsSummary ?? 0,
    ratingCount: payload.business.ratingsCount ?? 0,
    reviews:
      payload.business.reviews?.map((review) => ({
        reviewerName: review.reviewerName,
        rating: review.rating,
        comment: review.comment ?? undefined,
        createdAt: review.createdAt,
      })) ?? [],
    serviceInfo: payload.paymentLink.description ?? undefined,
    totalVerifiedBuyers: payload.business.totalVerifiedBuyers ?? 0,
    trustGrowth: payload.business.trustGrowth ?? "Not available yet",
    successfulTransactionsCount:
      payload.business.successfulTransactionsCount ?? 0,
    linkMode: isFixedAmount ? "fixed" : "generic",
    fixedAmount,
    suggestedAmount: fixedAmount,
  };
}

export async function getPublicPaymentPageByToken(
  token: string,
): Promise<PublicPaymentPageData | null> {
  try {
    const response = await httpInstance.get<GetPaymentPageSuccessResponse>(
      `/pay/${token}`,
    );
    return mapPaymentPageResponseToViewData(token, response.data.data);
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

export async function initiatePaymentByToken(
  token: string,
  input: InitiatePaymentInput,
): Promise<InitiatePaymentResult> {
  const body: InitiatePaymentRequest = {
    buyerName: input.buyerName,
    buyerEmail: input.buyerEmail,
    ...(input.amount ? { amount: Number(input.amount) } : {}),
    isServiceRendered: input.isServiceRendered ? true : false,
    rating: input.rating,
    feedback: input.feedback,
  };

  const response = await httpInstance.post<InitiatePaymentSuccessResponse>(
    `/pay/${token}`,
    body,
  );
  // const checkoutUrl = extractCheckoutUrl(response.data.data);

  // if (!checkoutUrl) {
  //   throw new Error(
  //     "Checkout URL is missing from payment initiation response.",
  //   );
  // }

  return {
    paymentId: response.data.data.paymentId,
    amount: response.data.data.amount,
    ratingToken: response.data.data.ratingToken,
    message: response.data.data.message,
    checkoutUrl: response.data.data.checkoutUrl,
  };
}

export async function submitRatingByToken(
  ratingToken: string,
  input: SubmitRatingInput,
): Promise<SubmitRatingSuccessResponse["data"]> {
  const body: SubmitRatingRequest = {
    rating: input.rating,
    ...(input.comment ? { comment: input.comment } : {}),
  };

  const response = await httpInstance.post<SubmitRatingSuccessResponse>(
    `/pay/rate/${ratingToken}`,
    body,
  );

  return response.data.data;
}
