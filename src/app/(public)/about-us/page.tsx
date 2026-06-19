export const dynamic = 'force-dynamic'

import React from "react";
import StaticPageLayout from "@/components/public/StaticPageLayout";

export const metadata = {
  title: "About Us | QSA Apparels",
  description: "Learn about QSA Apparels — founded by Wasi Alave, a premier BSCI & SEDEX certified garment manufacturer in Dhaka, Bangladesh with 10+ years of RMG industry experience.",
};

export default function AboutUsPage() {
  return <StaticPageLayout slug="about-us" />;
}

