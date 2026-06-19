export const dynamic = 'force-dynamic'

import React from "react";
import StaticPageLayout from "@/components/public/StaticPageLayout";

export const metadata = {
  title: "Our Services | QSA Apparels",
  description: "End-to-end garment manufacturing services: OEM, ODM, Private Label, Sampling, Quality Assurance, Logistics & Compliance Audit Support. BSCI & SEDEX certified factory in Bangladesh.",
};

export default function ServicesPage() {
  return <StaticPageLayout slug="services" />;
}

