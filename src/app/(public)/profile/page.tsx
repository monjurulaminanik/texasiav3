export const dynamic = 'force-dynamic'

import React from "react";
import StaticPageLayout from "@/components/public/StaticPageLayout";

export const metadata = {
  title: "Corporate Profile | QSA Apparels",
  description: "Learn more about QSA Apparels, a premier B2B apparel manufacturer and custom sourcing partner based in Dhaka, Bangladesh.",
};

export default function ProfilePage() {
  return <StaticPageLayout slug="profile" />;
}

