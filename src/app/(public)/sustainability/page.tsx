export const dynamic = 'force-dynamic'

import React from "react";
import StaticPageLayout from "@/components/public/StaticPageLayout";

export const metadata = {
  title: "Sustainability & Green Apparel | QSA Apparels",
  description: "Our commitment to ethical manufacturing: GOTS organic cotton sourcing, recycled polyester fabrics, and zero hazardous discharge in wet processing.",
};

export default function SustainabilityPage() {
  return <StaticPageLayout slug="sustainability" />;
}

