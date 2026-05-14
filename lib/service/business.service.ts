import httpInstance from "@/lib/config/http.config";

export type BusinessTier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM";

export type BusinessListItem = {
  id: number;
  name: string;
  description: string | null;
  logo: string | null;
  category: string | null;
  slug: string;
  trustScore: number;
  kycStatus: string;
  tier: string | null;
  showCaseImages: string[];
};

type GetBusinessesSuccessResponse = {
  status: string;
  statusCode: number;
  data: BusinessListItem[];
};

export type SearchBusinessesParams = {
  search?: string;
  category?: string;
};

export type HomeVendorCardData = {
  business: {
    name: string;
    description: string;
    logo: string;
    showcaseImages: string[];
    slug: string;
    trustScore: number;
    tier: {
      name: BusinessTier;
    };
  };
  category: string;
  ratingSummary: number;
  ratingCount: number;
};

const TIER_VALUES: BusinessTier[] = ["BRONZE", "SILVER", "GOLD", "PLATINUM"];

function toBusinessTier(tier: string | null): BusinessTier {
  if (!tier) {
    return "BRONZE";
  }

  const normalizedTier = tier.toUpperCase();
  return TIER_VALUES.includes(normalizedTier as BusinessTier)
    ? (normalizedTier as BusinessTier)
    : "BRONZE";
}

export async function getBusinesses(
  params: SearchBusinessesParams = {},
): Promise<BusinessListItem[]> {
  const response = await httpInstance.get<GetBusinessesSuccessResponse>(
    "/business",
    {
      params: {
        ...(params.search ? { search: params.search } : {}),
        ...(params.category ? { category: params.category } : {}),
      },
    },
  );

  return response.data.data;
}

export function mapBusinessToHomeVendorCard(
  item: BusinessListItem,
): HomeVendorCardData {
  return {
    business: {
      name: item.name,
      description: item.description ?? "",
      logo: item.logo ?? item.showCaseImages?.[0] ?? "",
      showcaseImages: item.showCaseImages ?? [],
      slug: item.slug,
      trustScore: Number(item.trustScore) || 0,
      tier: {
        name: toBusinessTier(item.tier),
      },
    },
    category: item.category ?? "Uncategorized",
    ratingSummary: 0,
    ratingCount: 0,
  };
}
