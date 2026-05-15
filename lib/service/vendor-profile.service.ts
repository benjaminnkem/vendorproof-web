import { AxiosError } from "axios";
import httpInstance from "@/lib/config/http.config";

export type VendorTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

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

export type VendorReview = {
  reviewerName?: string;
  rating: number;
  comment?: string;
  createdAt: string;
};

export type TrustScoreHistory = {
  score: number;
  createdAt: string;
};

export type VendorProfilePageData = {
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
    paymentLink?: string;
  };
  socials: SocialLink[];
  businessPhoneNumber: string;
  alternativePhoneNumber?: string;
  category: string;
  servicesOffered: string[];
  totalAmountTransacted: number;
  ratingSummary: number;
  ratingCount: number;
  reviews: VendorReview[];
  serviceInfo?: string;
  trustHistory: string;
  totalVerifiedBuyers: string;
  disputeFreeRate: string;
  trustGrowth: string;
  successfulTransactions: string;
};

type PublicProfileApiResponse = {
  status: string;
  statusCode: number;
  data: {
    id: number;
    name: string;
    description: string | null;
    logo: string | null;
    showCaseImages: string[];
    phoneNumber: string | null;
    alternativePhoneNumber: string | null;
    category: string | null;
    slug: string;
    trustScore: number;
    kycStatus: string;
    paymentLink: string | null;
    socials: Array<{
      platform: string;
      url: string;
    }>;
    tier: {
      name: string;
      description: string | null;
    } | null;
    trustScoreHistories: Array<{
      score: number;
      createdAt: string;
    }>;
    services: Array<{
      name: string;
      description: string | null;
    }>;
    totalAmountTransacted: number;
    ratingsSummary: number;
    ratingsCount: number;
    reviews: Array<{
      reviewerName?: string;
      rating: number;
      comment?: string;
      createdAt: string;
    }>;
    totalVerifiedBuyers: number;
    trustGrowth: string;
    successfulTransactionsCount: number;
  };
};

const TIER_VALUES: VendorTier[] = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];

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
  const supported: SocialPlatform[] = [
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

  return supported.includes(normalized) ? normalized : "OTHER";
}

function getFallbackProfileLink(slug: string) {
  return `https://vendorproof.example/vendor/${slug}`;
}

export function mapPublicProfileToVendorProfileData(
  payload: PublicProfileApiResponse["data"],
): VendorProfilePageData {
  const trustHistories =
    payload.trustScoreHistories?.length > 0
      ? payload.trustScoreHistories
      : [
          {
            score: payload.trustScore ?? 0,
            createdAt: new Date().toISOString(),
          },
        ];

  const socials =
    payload.socials?.map((social) => ({
      platform: normalizePlatform(social.platform),
      url: social.url,
    })) ?? [];

  const hasWebsite = socials.some((social) => social.platform === "WEBSITE");

  if (payload.paymentLink && !hasWebsite) {
    socials.unshift({
      platform: "WEBSITE",
      url: payload.paymentLink,
    });
  }

  return {
    business: {
      name: payload.name,
      description:
        payload.description ?? "No business description available yet.",
      logo:
        payload.logo ??
        payload.showCaseImages?.[0] ??
        "/images/vendor-placeholder.png",
      showcaseImages: payload.showCaseImages ?? [],
      slug: payload.slug,
      paymentLink: payload.paymentLink!,
      trustScore: Number(payload.trustScore) || 0,
      kycStatus: normalizeKycStatus(payload.kycStatus),
      tier: {
        name: normalizeTier(payload.tier?.name),
      },
      trustScoreHistories: trustHistories,
    },
    socials,
    businessPhoneNumber: payload.phoneNumber ?? "Not available",
    alternativePhoneNumber: payload.alternativePhoneNumber ?? undefined,
    category: payload.category ?? "Uncategorized",
    servicesOffered: payload.services?.map((service) => service.name) ?? [],
    totalAmountTransacted: payload.totalAmountTransacted ?? 0,
    ratingSummary: payload.ratingsSummary ?? 0,
    ratingCount: payload.ratingsCount ?? 0,
    reviews: payload.reviews ?? [],
    serviceInfo: undefined,
    trustHistory: payload.trustGrowth ?? "Not available yet",
    totalVerifiedBuyers: payload.totalVerifiedBuyers?.toLocaleString() ?? "0",
    disputeFreeRate: "100%",
    trustGrowth: payload.trustGrowth ?? "Not available yet",
    successfulTransactions:
      payload.successfulTransactionsCount?.toLocaleString() ?? "0",
  };
}

export async function getPublicVendorProfileBySlug(
  slug: string,
): Promise<VendorProfilePageData | null> {
  try {
    const response = await httpInstance.get<PublicProfileApiResponse>(
      `/business/${slug}`,
    );
    return mapPublicProfileToVendorProfileData(response.data.data);
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}
