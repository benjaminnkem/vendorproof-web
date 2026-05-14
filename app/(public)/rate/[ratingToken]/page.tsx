import { PublicRatingPage } from "@/components/ui/rating/public-rating-page";
import { PAYMENT_RATINGS, getPaymentRatingById } from "@/lib/data/mock-vendors";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type RouteProps = {
  params: Promise<{ paymentId: string }>;
};

export async function generateMetadata({
  params,
}: RouteProps): Promise<Metadata> {
  const { paymentId } = await params;
  const parsedPaymentId = Number(paymentId);
  const payment = Number.isNaN(parsedPaymentId)
    ? undefined
    : getPaymentRatingById(parsedPaymentId);

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

export function generateStaticParams() {
  return PAYMENT_RATINGS.map((payment) => ({
    paymentId: payment.paymentId.toString(),
  }));
}

export default async function PaymentRatingRoute({ params }: RouteProps) {
  const { paymentId } = await params;
  const parsedPaymentId = Number(paymentId);

  if (Number.isNaN(parsedPaymentId)) {
    notFound();
  }

  const payment = getPaymentRatingById(parsedPaymentId);

  if (!payment) {
    notFound();
  }

  return <PublicRatingPage payment={payment} />;
}
