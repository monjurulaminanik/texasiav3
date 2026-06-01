export const dynamic = 'force-dynamic'

import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "http://localhost:3000";

  // Query DB entities dynamically
  let categories: { slug: string }[] = [];
  let products: { slug: string; category: { slug: string } }[] = [];
  let blogs: { slug: string }[] = [];
  let jobs: { slug: string }[] = [];

  try {
    categories = await prisma.category.findMany({ select: { slug: true } });
    products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, category: { select: { slug: true } } },
    });
    blogs = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true },
    });
    jobs = await prisma.job.findMany({
      where: { isActive: true },
      select: { slug: true },
    });
  } catch (err) {
    console.error("Sitemap generation database query failure:", err);
  }

  // Static core pathways
  const staticRoutes = [
    "",
    "/products",
    "/news",
    "/career",
    "/faq",
    "/contact",
    "/request-for-quotation",
    "/profile",
    "/why-choose-us",
    "/sustainability",
    "/accreditation",
    "/membership",
  ];

  const staticUrls = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/products/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const productUrls = products.map((prod) => ({
    url: `${baseUrl}/products/${prod.category.slug}/${prod.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const blogUrls = blogs.map((blog) => ({
    url: `${baseUrl}/news/${blog.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const jobUrls = jobs.map((job) => ({
    url: `${baseUrl}/career/${job.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticUrls, ...categoryUrls, ...productUrls, ...blogUrls, ...jobUrls];
}

