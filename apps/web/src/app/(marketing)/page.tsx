import { FeatureGrid } from "@/components/marketing/feature-grid";
import { Hero } from "@/components/marketing/hero";
import { PricingTable } from "@/components/marketing/pricing-table";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <PricingTable />
    </>
  );
}
