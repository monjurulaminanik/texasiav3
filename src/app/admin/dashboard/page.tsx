export const dynamic = 'force-dynamic'

import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
  ShoppingBag,
  FileText,
  Inbox,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  // Fetch all dashboard metrics in parallel for speed
  const [
    totalProducts,
    publishedPosts,
    newRfqs,
    newContacts,
    recentRfqs,
    recentContacts,
    recentPosts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.rFQ.count({ where: { status: "new" } }),
    prisma.contact.count({ where: { status: "new" } }),
    prisma.rFQ.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { author: { select: { name: true } } },
    }),
  ]);

  const stats = [
    {
      name: "Total Products",
      value: totalProducts,
      icon: ShoppingBag,
      color: "from-blue-600 to-cyan-500",
      href: "/admin/products",
    },
    {
      name: "Published Blogs",
      value: publishedPosts,
      icon: FileText,
      color: "from-emerald-600 to-teal-500",
      href: "/admin/blog",
    },
    {
      name: "New RFQs",
      value: newRfqs,
      icon: Inbox,
      color: "from-amber-600 to-orange-500",
      href: "/admin/rfqs",
    },
    {
      name: "New Contacts",
      value: newContacts,
      icon: MessageSquare,
      color: "from-rose-600 to-pink-500",
      href: "/admin/contacts",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#081a33] to-[#0b2545] p-6 rounded-2xl border border-[#0f2545]">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white font-heading">
            Welcome back, {session.user?.name || "Admin"}!
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Here's what is happening with QSA Apparels today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-[#d4a574]/10 text-[#d4a574] px-3 py-1.5 rounded-lg border border-[#d4a574]/20 font-semibold self-start md:self-auto">
          <TrendingUp className="w-4 h-4" />
          SYSTEMS FULLY OPERATIONAL
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-[#081a33]/40 border border-[#0f2545] rounded-2xl p-6 hover:border-[#d4a574]/50 transition-premium group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">
                  {stat.name}
                </span>
                <div className={`p-2 rounded-xl bg-gradient-to-tr ${stat.color} bg-opacity-20`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white font-heading">
                  {stat.value}
                </span>
                <span className="text-xs text-[#d4a574] group-hover:translate-x-1 transition-premium flex items-center gap-0.5 ml-auto">
                  Manage <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Grid of details tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Recent RFQs */}
        <div className="bg-[#081a33]/40 border border-[#0f2545] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#0f2545] pb-4">
            <h3 className="font-bold text-white font-heading flex items-center gap-2">
              <Inbox className="w-5 h-5 text-[#d4a574]" /> Recent RFQ Inquiries
            </h3>
            <Link
              href="/admin/rfqs"
              className="text-xs text-[#d4a574] hover:underline flex items-center gap-1"
            >
              View Inbox <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {recentRfqs.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">No RFQs received yet.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-400 font-semibold border-b border-[#0f2545]/50 pb-2">
                    <th className="py-2">Company</th>
                    <th className="py-2">Product</th>
                    <th className="py-2">Qty</th>
                    <th className="py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0f2545]/20">
                  {recentRfqs.map((rfq) => (
                    <tr
                      key={rfq.id}
                      className="hover:bg-[#0b2545]/30 transition-premium cursor-pointer group"
                    >
                      <td className="py-3 pr-2 font-medium text-white group-hover:text-[#d4a574]">
                        {rfq.companyName}
                        <span className="block text-[11px] text-slate-500 font-normal">
                          {rfq.contactName} ({rfq.country || "Global"})
                        </span>
                      </td>
                      <td className="py-3 text-slate-300 pr-2">{rfq.productType || "Garment"}</td>
                      <td className="py-3 text-slate-300 pr-2">{rfq.quantity || "N/A"}</td>
                      <td className="py-3 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            rfq.status === "new"
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : rfq.status === "contacted"
                              ? "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                              : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          }`}
                        >
                          {rfq.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="bg-[#081a33]/40 border border-[#0f2545] rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#0f2545] pb-4">
            <h3 className="font-bold text-white font-heading flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#d4a574]" /> Recent Contact Messages
            </h3>
            <Link
              href="/admin/contacts"
              className="text-xs text-[#d4a574] hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {recentContacts.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-6">No contact messages yet.</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-400 font-semibold border-b border-[#0f2545]/50 pb-2">
                    <th className="py-2">Sender</th>
                    <th className="py-2">Subject</th>
                    <th className="py-2 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0f2545]/20">
                  {recentContacts.map((contact) => (
                    <tr
                      key={contact.id}
                      className="hover:bg-[#0b2545]/30 transition-premium cursor-pointer group"
                    >
                      <td className="py-3 pr-2 font-medium text-white group-hover:text-[#d4a574]">
                        {contact.name}
                        <span className="block text-[11px] text-slate-500 font-normal">
                          {contact.email}
                        </span>
                      </td>
                      <td className="py-3 text-slate-300 pr-2 max-w-[200px] truncate">
                        {contact.subject || "No Subject"}
                      </td>
                      <td className="py-3 text-slate-500 text-right text-xs">
                        {formatDistanceToNow(new Date(contact.createdAt))} ago
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Recent Blog Posts */}
      <div className="bg-[#081a33]/40 border border-[#0f2545] rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#0f2545] pb-4">
          <h3 className="font-bold text-white font-heading flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#d4a574]" /> Recent Blog Insights
          </h3>
          <Link
            href="/admin/blog"
            className="text-xs text-[#d4a574] hover:underline flex items-center gap-1"
          >
            Manage Blog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.length === 0 ? (
            <p className="col-span-full text-slate-500 text-sm text-center py-6">No blog posts found.</p>
          ) : (
            recentPosts.map((post) => (
              <div
                key={post.id}
                className="bg-[#040d1a]/40 border border-[#0f2545]/50 rounded-xl p-5 hover:border-[#d4a574]/30 transition-premium flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(post.createdAt))} ago
                    </span>
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        post.isPublished
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                      }`}
                    >
                      {post.isPublished ? "Published" : "Draft"}
                    </span>
                  </div>
                  <h4 className="font-bold text-white font-heading text-sm line-clamp-2 hover:text-[#d4a574]">
                    {post.title}
                  </h4>
                  <p className="text-slate-400 text-xs mt-2 line-clamp-2">
                    {post.excerpt || "No excerpt details."}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#0f2545]/50 flex items-center justify-between text-[11px] text-slate-500">
                  <span>By {post.author.name}</span>
                  <span className="text-[#d4a574]">{post.views} views</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

