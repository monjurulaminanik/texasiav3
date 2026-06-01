import React from "react";
import PageBuilderEditor from "@/components/admin/PageBuilderEditor";

interface PageBuilderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PageBuilderPage({ params }: PageBuilderPageProps) {
  const resolvedParams = await params;
  return <PageBuilderEditor pageId={resolvedParams.id} />;
}
