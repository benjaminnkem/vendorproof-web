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
  | "WEBSITE";

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
};

export type VerificationChecks = {
  cacVerified: boolean;
  faceVerified: boolean;
  documentVerified: boolean;
  phoneVerified: boolean;
};

export type VendorMetric = {
  label: string;
  value: string;
  trend: string;
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

export type BusinessPayload = {
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

export type VendorPaymentPageData = {
  business: BusinessPayload;
  socials: SocialLink[];
  verificationChecks: VerificationChecks;
  ownerName: string;
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
  totalReputation: string;
  totalVerifiedBuyers: string;
  disputeFreeRate: string;
  trustGrowth: string;
  successfulTransactions: string;
  linkMode: PaymentLinkMode;
  fixedAmount?: number;
  suggestedAmount?: number;
  squadCheckoutUrl: string;
  metrics: VendorMetric[];
};

export type PaymentRatingPageData = {
  paymentId: number;
  buyerName: string;
  amount: number;
  business: Pick<BusinessPayload, "name" | "logo" | "slug" | "trustScore">;
};

export const VENDORS: VendorPaymentPageData[] = [
  {
    business: {
      name: "Ada Groceries Ltd",
      description: "Retail grocery supplier for households and restaurants.",
      logo: "https://res.cloudinary.com/demo/image/upload/logo.jpg",
      showcaseImages: [
        "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1280&q=80",
        "https://images.unsplash.com/photo-1601599963565-b7f4f7423384?auto=format&fit=crop&w=1280&q=80",
        "https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=1280&q=80",
      ],
      slug: "ada-groceries-ltd",
      trustScore: 72.5,
      kycStatus: "VERIFIED",
      tier: {
        name: "BRONZE",
      },
      trustScoreHistories: [
        {
          score: 62.2,
          createdAt: "2025-12-01T10:00:00.000Z",
        },
        {
          score: 64.9,
          createdAt: "2026-01-01T10:00:00.000Z",
        },
        {
          score: 66.1,
          createdAt: "2026-02-01T10:00:00.000Z",
        },
        {
          score: 68,
          createdAt: "2026-04-01T10:00:00.000Z",
        },
        {
          score: 72.5,
          createdAt: "2026-05-01T10:00:00.000Z",
        },
      ],
    },
    socials: [
      { platform: "WEBSITE", url: "https://adagroceries.example.com" },
      { platform: "INSTAGRAM", url: "https://instagram.com/adagroceries" },
      { platform: "WHATSAPP", url: "https://wa.me/2348032104501" },
      { platform: "FACEBOOK", url: "https://facebook.com/adagroceries" },
      { platform: "TWITTER", url: "https://x.com/adagroceries" },
    ],
    verificationChecks: {
      cacVerified: true,
      faceVerified: true,
      documentVerified: true,
      phoneVerified: true,
    },
    ownerName: "Adaeze Okonkwo",
    businessPhoneNumber: "+234 803 210 4501",
    alternativePhoneNumber: "+234 802 445 1829",
    category: "Retail Grocery Supplier",
    servicesOffered: [
      "Bulk Grocery Supply",
      "Restaurant Restock",
      "Household Essentials",
      "Doorstep Delivery",
    ],
    totalAmountTransacted: 1240000,
    ratingSummary: 4.6,
    ratingCount: 86,
    reviews: [
      {
        reviewerName: "Grace M.",
        rating: 5,
        comment: "Always delivers on time and product quality is consistent.",
        createdAt: "2026-04-25T09:40:00.000Z",
      },
      {
        reviewerName: "Samuel A.",
        rating: 4,
        comment: "Smooth communication and clear pricing.",
        createdAt: "2026-04-19T14:15:00.000Z",
      },
      {
        rating: 5,
        comment: "Reliable vendor for repeat monthly supplies.",
        createdAt: "2026-04-10T18:03:00.000Z",
      },
    ],
    serviceInfo: "Bulk grocery order payment",
    trustHistory: "Consistent for 11 months",
    totalReputation: "3,280 successful payments",
    totalVerifiedBuyers: "1,940 verified buyers",
    disputeFreeRate: "98.7% dispute-free",
    trustGrowth: "+6.8% in last 90 days",
    successfulTransactions: "4,102 completed transactions",
    linkMode: "fixed",
    fixedAmount: 45000,
    suggestedAmount: 45000,
    squadCheckoutUrl:
      "https://checkout.squadco.com/pay/vendorproof-adagroceries",
    metrics: [
      { label: "Dispute Rate", value: "1.3%", trend: "Low" },
      { label: "Avg Fulfillment", value: "2.1 days", trend: "Stable" },
      { label: "Repeat Buyers", value: "57%", trend: "Growing" },
      { label: "Trust Velocity", value: "+4", trend: "Monthly" },
    ],
  },
  {
    business: {
      name: "Nova Tech Repairs",
      description:
        "Identity and behavior verified repair studio with transparent diagnostics and verified payment reputation.",
      logo: "https://res.cloudinary.com/demo/image/upload/logo2.jpg",
      showcaseImages: [
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1280&q=80",
        "https://images.unsplash.com/photo-1581091870622-2cf66f7da7ac?auto=format&fit=crop&w=1280&q=80",
        "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1280&q=80",
      ],
      slug: "nova-tech-repairs",
      trustScore: 84,
      kycStatus: "VERIFIED",
      tier: {
        name: "SILVER",
      },
      trustScoreHistories: [
        {
          score: 73,
          createdAt: "2025-12-01T10:00:00.000Z",
        },
        {
          score: 77,
          createdAt: "2026-01-01T10:00:00.000Z",
        },
        {
          score: 80,
          createdAt: "2026-02-01T10:00:00.000Z",
        },
        {
          score: 82,
          createdAt: "2026-03-01T10:00:00.000Z",
        },
        {
          score: 84,
          createdAt: "2026-04-01T10:00:00.000Z",
        },
      ],
    },
    socials: [
      { platform: "WEBSITE", url: "https://novatechrepairs.example.com" },
      { platform: "INSTAGRAM", url: "https://instagram.com/novatechrepairs" },
      { platform: "WHATSAPP", url: "https://wa.me/2348109927812" },
      {
        platform: "LINKEDIN",
        url: "https://linkedin.com/company/novatechrepairs",
      },
      { platform: "YOUTUBE", url: "https://youtube.com/@novatechrepairs" },
    ],
    verificationChecks: {
      cacVerified: true,
      faceVerified: true,
      documentVerified: true,
      phoneVerified: false,
    },
    ownerName: "Sodiq Musa",
    businessPhoneNumber: "+234 810 992 7812",
    alternativePhoneNumber: "+234 809 337 4450",
    category: "Device Repair Services",
    servicesOffered: [
      "Phone Repair",
      "Laptop Diagnostics",
      "Screen Replacement",
      "On-site Installation",
    ],
    totalAmountTransacted: 2375000,
    ratingSummary: 4.5,
    ratingCount: 104,
    reviews: [
      {
        reviewerName: "David K.",
        rating: 5,
        comment: "Fast repairs and transparent updates all through.",
        createdAt: "2026-04-28T11:20:00.000Z",
      },
      {
        reviewerName: "Amina B.",
        rating: 4,
        comment: "Professional support and good after-service follow up.",
        createdAt: "2026-04-22T16:32:00.000Z",
      },
      {
        reviewerName: "Anonymous",
        rating: 4,
        comment: "Quality work. Delivery timeline was fair.",
        createdAt: "2026-04-09T09:00:00.000Z",
      },
    ],
    serviceInfo: "Diagnostic and repair advance payment",
    trustHistory: "Active and improving for 9 months",
    totalReputation: "2,170 successful payments",
    totalVerifiedBuyers: "1,120 verified buyers",
    disputeFreeRate: "98.8% dispute-free",
    trustGrowth: "+9.4% in last 90 days",
    successfulTransactions: "2,635 completed transactions",
    linkMode: "generic",
    suggestedAmount: 25000,
    squadCheckoutUrl: "https://checkout.squadco.com/pay/vendorproof-novatech",
    metrics: [
      { label: "Dispute Rate", value: "1.2%", trend: "Strong" },
      { label: "Avg Fulfillment", value: "2.4 days", trend: "Stable" },
      { label: "Repeat Buyers", value: "54%", trend: "Rising" },
      { label: "Trust Velocity", value: "+5", trend: "Monthly" },
    ],
  },
];

export const PAYMENT_RATINGS: PaymentRatingPageData[] = [
  {
    paymentId: 42,
    buyerName: "Emeka Obi",
    amount: 5000,
    business: {
      name: "Ada Groceries Ltd",
      logo: "https://res.cloudinary.com/demo/image/upload/logo.jpg",
      slug: "ada-groceries-ltd",
      trustScore: 72.5,
    },
  },
  {
    paymentId: 43,
    buyerName: "Mariam Bello",
    amount: 18500,
    business: {
      name: "Nova Tech Repairs",
      logo: "https://res.cloudinary.com/demo/image/upload/logo2.jpg",
      slug: "nova-tech-repairs",
      trustScore: 84,
    },
  },
];

export function getVendorBySlug(
  slug: string,
): VendorPaymentPageData | undefined {
  return VENDORS.find((vendor) => vendor.business.slug === slug);
}

export function getPaymentRatingById(
  paymentId: number,
): PaymentRatingPageData | undefined {
  return PAYMENT_RATINGS.find((payment) => payment.paymentId === paymentId);
}
