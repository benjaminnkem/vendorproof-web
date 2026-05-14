import { VendorProfilePage } from "@/components/ui/vendor-profile/vendor-profile-page";
import { getPublicVendorProfileBySlug } from "@/lib/service/vendor-profile.service";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type RouteProps = {
  params: Promise<{ vendorSlug: string }>;
};

export async function generateMetadata({
  params,
}: RouteProps): Promise<Metadata> {
  const { vendorSlug } = await params;
  const vendor = await getPublicVendorProfileBySlug(vendorSlug);

  if (!vendor) {
    return {
      title: "Vendor profile not found | VendorProof",
    };
  }

  return {
    title: `${vendor.business.name} Profile | VendorProof`,
    description: `Public trust profile for ${vendor.business.name}.`,
  };
}

export default async function VendorProfileRoute({ params }: RouteProps) {
  const { vendorSlug } = await params;
  const vendor = await getPublicVendorProfileBySlug(vendorSlug);

  if (!vendor) {
    notFound();
  }

  return (
    <main className="vp-ambient-grid vp-page">
      <section className="w-full px-1 sm:px-2">
        <VendorProfilePage vendor={vendor} />
      </section>
    </main>
  );
}
