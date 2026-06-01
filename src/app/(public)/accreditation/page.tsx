export const dynamic = 'force-dynamic'

import React from "react";
import StaticPageLayout from "@/components/public/StaticPageLayout";

export const metadata = {
  title: "Accreditation & Compliance | Texasia International",
  description: "Browse our factory compliance certifications: BSCI, SEDEX 4-Pillar, OEKO-TEX Standard 100, and WRAP gold-certified safety audits.",
};

export default function AccreditationPage() {
  return <StaticPageLayout slug="accreditation" />;
}

