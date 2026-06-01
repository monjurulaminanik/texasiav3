export const dynamic = 'force-dynamic'

import React from "react";
import StaticPageLayout from "@/components/public/StaticPageLayout";

export const metadata = {
  title: "About Us | Texasia International Fashion Co., Ltd.",
  description: "Learn about Texasia International — founded by Rahamatullah Rony, a premier BSCI & SEDEX certified garment manufacturer in Dhaka, Bangladesh with 10+ years of RMG industry experience.",
};

export default function AboutUsPage() {
  return <StaticPageLayout slug="about-us" />;
}

