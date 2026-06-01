"use client";

import { useEffect } from "react";

export default function IncrementViews({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/blog/views?slug=${slug}`, { method: "POST" }).catch(console.error);
  }, [slug]);

  return null;
}
