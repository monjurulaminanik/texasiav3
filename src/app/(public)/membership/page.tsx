export const dynamic = 'force-dynamic'

import React from "react";
import StaticPageLayout from "@/components/public/StaticPageLayout";

export const metadata = {
  title: "Trade Memberships | QSA Apparels",
  description: "Official trade partnerships including BGMEA (Bangladesh Garment Manufacturers and Exporters Association) and BKMEA compliance standards.",
};

export default function MembershipPage() {
  return <StaticPageLayout slug="membership" />;
}

