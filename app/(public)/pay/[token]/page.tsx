import { PublicPaymentPage } from "@/components/ui/payment/public-payment-page";
import { getPublicPaymentPageByToken } from "@/lib/service/payment.service";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type RouteProps = {
  params: Promise<{ token: string }>;
};

export async function generateMetadata({
  params,
}: RouteProps): Promise<Metadata> {
  const { token } = await params;
  const vendor = await getPublicPaymentPageByToken(token);

  if (!vendor) {
    return {
      title: "Vendor not found | VendorProof",
    };
  }

  return {
    title: `${vendor.business.name} Payment | VendorProof`,
    description: `Trust-first payment page for ${vendor.business.name}.`,
  };
}

export default async function VendorPaymentRoute({ params }: RouteProps) {
  const { token } = await params;
  const vendor = await getPublicPaymentPageByToken(token);

  if (!vendor) {
    notFound();
  }

  return <PublicPaymentPage vendor={vendor} />;
}
