import { AxiosError } from "axios";
import httpInstance from "@/lib/config/http.config";

export type PublicRatingPageData = {
  paymentId: number;
  buyerName: string;
  amount: number;
  business: {
    name: string;
    logo: string;
    slug: string;
    trustScore: number;
  };
};

type GetRatingPageSuccessResponse = {
  status: string;
  statusCode: number;
  data: {
    paymentId: number;
    buyerName: string;
    amount: number;
    business: {
      name: string;
      logo: string | null;
      slug: string;
      trustScore: number;
    };
  };
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

export type SubmitRatingResult = {
  message: string;
  newTrustScore: number;
};

function mapRatingPageResponseToViewData(
  payload: GetRatingPageSuccessResponse["data"],
): PublicRatingPageData {
  return {
    paymentId: payload.paymentId,
    buyerName: payload.buyerName,
    amount: payload.amount,
    business: {
      name: payload.business.name,
      logo: payload.business.logo ?? "/images/vendor-placeholder.png",
      slug: payload.business.slug,
      trustScore: Number(payload.business.trustScore) || 0,
    },
  };
}

export async function getPublicRatingPageByToken(
  ratingToken: string,
): Promise<PublicRatingPageData | null> {
  try {
    const response = await httpInstance.get<GetRatingPageSuccessResponse>(
      `/pay/rate/${ratingToken}`,
    );

    return mapRatingPageResponseToViewData(response.data.data);
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

export async function submitPublicRatingByToken(
  ratingToken: string,
  input: SubmitRatingInput,
): Promise<SubmitRatingResult> {
  const body: SubmitRatingRequest = {
    rating: input.rating,
    ...(input.comment ? { comment: input.comment } : {}),
  };

  const response = await httpInstance.post<SubmitRatingSuccessResponse>(
    `/pay/rate/${ratingToken}`,
    body,
  );

  return {
    message: response.data.data.message,
    newTrustScore: response.data.data.newTrustScore,
  };
}
