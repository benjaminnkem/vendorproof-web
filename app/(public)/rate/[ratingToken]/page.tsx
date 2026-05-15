import { PublicRatingPage } from "@/components/ui/rating/public-rating-page";
import { getPublicRatingPageByToken } from "@/lib/service/rating.service";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type RouteProps = {
  params: Promise<{ ratingToken: string }>;
};

export async function generateMetadata({
  params,
}: RouteProps): Promise<Metadata> {
  const { ratingToken } = await params;
  const payment = await getPublicRatingPageByToken(ratingToken);

  if (!payment) {
    return {
      title: "Rating not found | VendorProof",
    };
  }

  return {
    title: `Rate ${payment.business.name} | VendorProof`,
    description: `Share a quick rating for payment #${payment.paymentId}.`,
  };
}

export default async function PaymentRatingRoute({ params }: RouteProps) {
  const { ratingToken } = await params;
  const payment = await getPublicRatingPageByToken(ratingToken);

  if (!payment) {
    notFound();
  }

  return <PublicRatingPage ratingToken={ratingToken} payment={payment} />;
}
