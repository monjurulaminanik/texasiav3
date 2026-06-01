export const dynamic = 'force-dynamic'

import React from "react";
import StaticPageLayout from "@/components/public/StaticPageLayout";

export const metadata = {
  title: "Corporate Profile | Texasia International",
  description: "Learn more about Texasia International Fashion Co., Ltd., a premier B2B apparel manufacturer and custom sourcing partner based in Dhaka, Bangladesh.",
};

export default function ProfilePage() {
  return <StaticPageLayout slug="profile" />;
}

