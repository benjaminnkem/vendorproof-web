import { PaymentVerificationReceiptPage } from "@/components/ui/payment/payment-verification-receipt-page";
import { getPaymentVerificationByReference } from "@/lib/service/payment-verification.service";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type RouteProps = {
  searchParams: Promise<{ reference?: string | string[] }>;
};

function getReference(
  reference: string | string[] | undefined,
): string | undefined {
  return Array.isArray(reference) ? reference[0] : reference;
}

export async function generateMetadata({
  searchParams,
}: RouteProps): Promise<Metadata> {
  const { reference: rawReference } = await searchParams;
  const reference = getReference(rawReference);

  if (!reference) {
    return {
      title: "Payment not found | VendorProof",
    };
  }

  const receipt = await getPaymentVerificationByReference(reference);

  if (!receipt) {
    return {
      title: "Payment not found | VendorProof",
    };
  }

  return {
    title: `Payment Receipt ${receipt.transactionReference ?? reference} | VendorProof`,
    description: "Verified VendorProof payment receipt.",
  };
}

export default async function PaymentVerificationRoute({
  searchParams,
}: RouteProps) {
  const { reference: rawReference } = await searchParams;
  const reference = getReference(rawReference);

  if (!reference) {
    notFound();
  }

  const receipt = await getPaymentVerificationByReference(reference);

  if (!receipt || receipt.status !== "COMPLETED") {
    notFound();
  }

  return <PaymentVerificationReceiptPage receipt={receipt} />;
}
