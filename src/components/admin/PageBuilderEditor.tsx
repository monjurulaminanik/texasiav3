"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save, Monitor, Tablet, Phone, Eye, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import "grapesjs/dist/css/grapes.min.css";

interface PageBuilderEditorProps {
  pageId: string;
}

export default function PageBuilderEditor({ pageId }: PageBuilderEditorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [pageData, setPageData] = useState<any>(null);
  const [activeDevice, setActiveDevice] = useState("desktop");
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Fetch initial page data from database
  useEffect(() => {
    async function loadPage() {
      try {
        const res = await fetch(`/api/pages?id=${pageId}`);
        if (!res.ok) throw new Error("Failed to fetch page data");
        const data = await res.json();
        setPageData(data);
      } catch (err: any) {
        toast.error(err.message || "Error loading page details");
        router.push("/admin/pages");
      } finally {
        setIsLoading(false);
      }
    }
    loadPage();
  }, [pageId, router]);

  // 2. Initialize GrapesJS editor
  useEffect(() => {
    if (isLoading || !pageData || typeof window === "undefined" || editorRef.current) return;

    // Dynamically import GrapesJS on the client side
    import("grapesjs").then((grapesjsModule) => {
      const grapesjs = grapesjsModule.default;

      // Initialize GrapesJS
      const editor = grapesjs.init({
        container: "#gjs",
        fromElement: false,
        height: "calc(100vh - 64px)",
        width: "auto",
        storageManager: false, // Handle saving manually
        assetManager: {
          assets: [
            "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800",
            "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800",
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
            "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800"
          ],
        },
        deviceManager: {
          devices: [
            { name: "desktop", width: "" },
            { name: "tablet", width: "768px", widthMedia: "768px" },
            { name: "mobile", width: "375px", widthMedia: "480px" }
          ]
        },
        styleManager: {
          sectors: [
            {
              name: "Layout & Spacing",
              open: true,
              buildProps: ["width", "height", "margin", "padding", "display", "flex-direction", "justify-content", "align-items"],
            },
            {
              name: "Typography",
              open: false,
              buildProps: ["font-family", "font-size", "font-weight", "color", "text-align", "line-height", "letter-spacing"],
            },
            {
              name: "Background & Style",
              open: false,
              buildProps: ["background-color", "background-image", "background-size", "border", "border-radius", "box-shadow"],
            }
          ]
        }
      });

      editorRef.current = editor;

      // 3. Define Custom Blocks Library
      const blockManager = editor.BlockManager;

      // === LAYOUT BLOCKS ===
      blockManager.add("section", {
        label: "Section Layout",
        category: "Layout Components",
        content: `<section style="padding: 60px 20px; background-color: #040d1a; min-height: 150px; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
          <div style="max-width: 1200px; width: 100%; margin: 0 auto;">
            <p style="text-align: center; color: #94a3b8; font-family: sans-serif;">Drag content widgets inside this container...</p>
          </div>
        </section>`,
      });

      blockManager.add("column-2", {
        label: "2-Columns",
        category: "Layout Components",
        content: `<div style="display: flex; flex-wrap: wrap; gap: 20px; width: 100%; margin: 20px 0;">
          <div style="flex: 1; min-width: 300px; padding: 20px; border: 1px dashed rgba(212, 165, 116, 0.2); border-radius: 8px; font-family: sans-serif;">
            <h3>Column 1</h3>
            <p>Drag elements here...</p>
          </div>
          <div style="flex: 1; min-width: 300px; padding: 20px; border: 1px dashed rgba(212, 165, 116, 0.2); border-radius: 8px; font-family: sans-serif;">
            <h3>Column 2</h3>
            <p>Drag elements here...</p>
          </div>
        </div>`,
      });

      blockManager.add("column-3", {
        label: "3-Columns",
        category: "Layout Components",
        content: `<div style="display: flex; flex-wrap: wrap; gap: 20px; width: 100%; margin: 20px 0;">
          <div style="flex: 1; min-width: 200px; padding: 15px; border: 1px dashed rgba(212, 165, 116, 0.2); border-radius: 8px; font-family: sans-serif;">
            <h3>Col 1</h3>
          </div>
          <div style="flex: 1; min-width: 200px; padding: 15px; border: 1px dashed rgba(212, 165, 116, 0.2); border-radius: 8px; font-family: sans-serif;">
            <h3>Col 2</h3>
          </div>
          <div style="flex: 1; min-width: 200px; padding: 15px; border: 1px dashed rgba(212, 165, 116, 0.2); border-radius: 8px; font-family: sans-serif;">
            <h3>Col 3</h3>
          </div>
        </div>`,
      });

      blockManager.add("spacer-divider", {
        label: "Spacer & Divider",
        category: "Layout Components",
        content: `<div style="padding: 20px 0; width: 100%;">
          <div style="border-top: 1px solid rgba(212, 165, 116, 0.3); width: 100%; margin: 10px 0;"></div>
        </div>`,
      });

      // === CONTENT WIDGETS ===
      blockManager.add("heading", {
        label: "Heading Block",
        category: "Standard Content",
        content: `<h2 style="color: #ffffff; font-family: 'Inter', sans-serif; font-size: 32px; font-weight: 800; margin-bottom: 16px; text-align: left; tracking: -0.02em;">Custom Section Title</h2>`,
      });

      blockManager.add("paragraph", {
        label: "Paragraph Block",
        category: "Standard Content",
        content: `<p style="color: #94a3b8; font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          This is a sample paragraph body. Double-click inside this text container to visually edit, replace, or customize your message instantly.
        </p>`,
      });

      blockManager.add("button", {
        label: "Action Button",
        category: "Standard Content",
        content: `<a href="#" style="display: inline-block; bg-color: #d4a574; background: #d4a574; color: #040d1a; font-weight: bold; font-family: 'Inter', sans-serif; font-size: 14px; padding: 12px 28px; border-radius: 12px; text-decoration: none; transition: all 0.3s ease; box-shadow: 0 10px 15px -3px rgba(212, 165, 116, 0.15);">Explore Catalog</a>`,
      });

      blockManager.add("image", {
        label: "Single Image",
        category: "Standard Content",
        content: `<img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800" alt="Garments Banner" style="max-width: 100%; height: auto; border-radius: 16px; border: 1px solid #0f2545;" />`,
      });

      blockManager.add("image-gallery", {
        label: "Image Gallery Grid",
        category: "Standard Content",
        content: `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; width: 100%; margin: 20px 0;">
          <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=300&fit=crop" style="width:100%; border-radius:12px; border: 1px solid #0f2545;" />
          <img src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&h=300&fit=crop" style="width:100%; border-radius:12px; border: 1px solid #0f2545;" />
          <img src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=300&fit=crop" style="width:100%; border-radius:12px; border: 1px solid #0f2545;" />
        </div>`,
      });

      blockManager.add("video-embed", {
        label: "Video Embed",
        category: "Standard Content",
        content: `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; background: #081a33; border: 1px solid #0f2545; border-radius: 16px; margin: 20px 0; width: 100%;">
          <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe>
        </div>`,
      });

      // === B2B BUSINESS BLOCKS ===
      blockManager.add("hero-banner", {
        label: "Hero Banner",
        category: "B2B Manufacturer Blocks",
        content: `<div style="padding: 100px 20px; background-image: linear-gradient(135deg, #040d1a 0%, #081a33 100%); text-align: center; border-radius: 24px; border: 1px solid #0f2545; width: 100%; margin: 30px 0; font-family: sans-serif;">
          <span style="color: #d4a574; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">Certified B2B Garment Factory</span>
          <h1 style="color: #ffffff; font-size: 48px; font-weight: 900; margin-top: 10px; margin-bottom: 20px;">Custom Sourcing and Apparel Manufacturing</h1>
          <p style="color: #94a3b8; font-size: 18px; max-width: 600px; margin: 0 auto 30px auto; line-height: 1.6;">LEED Gold certified factories in Bangladesh delivering custom OEM/ODM products with flexible 500 pcs MOQ.</p>
          <a href="/request-for-quotation" style="display: inline-block; background: #d4a574; color: #040d1a; padding: 14px 32px; border-radius: 12px; font-weight: bold; text-decoration: none;">Request Free Quote</a>
        </div>`,
      });

      blockManager.add("stats-counter", {
        label: "Stats Grid",
        category: "B2B Manufacturer Blocks",
        content: `<div style="display: flex; flex-wrap: wrap; justify-content: space-around; gap: 20px; width: 100%; padding: 40px; background: rgba(8, 26, 51, 0.4); border: 1px solid #0f2545; border-radius: 20px; margin: 30px 0; text-align: center; font-family: sans-serif;">
          <div>
            <span style="font-size: 36px; font-weight: 800; color: #d4a574; display: block;">15+ Years</span>
            <span style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase;">Exporting Experience</span>
          </div>
          <div>
            <span style="font-size: 36px; font-weight: 800; color: #d4a574; display: block;">2 Million Pcs</span>
            <span style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase;">Monthly Capacity</span>
          </div>
          <div>
            <span style="font-size: 36px; font-weight: 800; color: #d4a574; display: block;">500 Pcs</span>
            <span style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase;">Low MOQ Sourcing</span>
          </div>
          <div>
            <span style="font-size: 36px; font-weight: 800; color: #d4a574; display: block;">BSCI & WRAP</span>
            <span style="font-size: 10px; font-weight: bold; color: #64748b; text-transform: uppercase;">Certified Facilities</span>
          </div>
        </div>`,
      });

      blockManager.add("certifications-strip", {
        label: "Accreditation Badge Strip",
        category: "B2B Manufacturer Blocks",
        content: `<div style="padding: 20px; background: #040d1a; border-radius: 12px; border: 1px solid #0f2545; width: 100%; margin: 20px 0; display: flex; justify-content: center; align-items: center; gap: 40px; flex-wrap: wrap; font-family: sans-serif;">
          <span style="color: #64748b; font-weight: bold; font-size: 12px; text-transform: uppercase;">Accredited By:</span>
          <span style="color: #ffffff; font-weight: 900; font-size: 16px; border: 1px solid #0f2545; padding: 4px 12px; border-radius: 6px;">BSCI</span>
          <span style="color: #ffffff; font-weight: 900; font-size: 16px; border: 1px solid #0f2545; padding: 4px 12px; border-radius: 6px;">SEDEX</span>
          <span style="color: #ffffff; font-weight: 900; font-size: 16px; border: 1px solid #0f2545; padding: 4px 12px; border-radius: 6px;">WRAP</span>
          <span style="color: #ffffff; font-weight: 900; font-size: 16px; border: 1px solid #0f2545; padding: 4px 12px; border-radius: 6px;">OEKO-TEX</span>
        </div>`,
      });

      blockManager.add("team-grid", {
        label: "Team Grid",
        category: "B2B Manufacturer Blocks",
        content: `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; width: 100%; margin: 30px 0; font-family: sans-serif;">
          <div style="background: #081a33; border: 1px solid #0f2545; padding: 24px; border-radius: 16px; text-align: center;">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: #0b2545; margin: 0 auto 16px auto; border: 2px solid #d4a574; overflow:hidden;">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" style="width:100%;height:100%;object-fit:cover;" />
            </div>
            <h4 style="color:#ffffff; font-weight:bold; margin-bottom:4px;">Sarah Rahman</h4>
            <p style="color:#d4a574; font-size:12px; margin:0;">Head Merchandiser</p>
          </div>
          <div style="background: #081a33; border: 1px solid #0f2545; padding: 24px; border-radius: 16px; text-align: center;">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: #0b2545; margin: 0 auto 16px auto; border: 2px solid #d4a574; overflow:hidden;">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" style="width:100%;height:100%;object-fit:cover;" />
            </div>
            <h4 style="color:#ffffff; font-weight:bold; margin-bottom:4px;">Zahir Islam</h4>
            <p style="color:#d4a574; font-size:12px; margin:0;">QA Director</p>
          </div>
          <div style="background: #081a33; border: 1px solid #0f2545; padding: 24px; border-radius: 16px; text-align: center;">
            <div style="width: 80px; height: 80px; border-radius: 50%; background: #0b2545; margin: 0 auto 16px auto; border: 2px solid #d4a574; overflow:hidden;">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" style="width:100%;height:100%;object-fit:cover;" />
            </div>
            <h4 style="color:#ffffff; font-weight:bold; margin-bottom:4px;">Rony Ahmed</h4>
            <p style="color:#d4a574; font-size:12px; margin:0;">Production Head</p>
          </div>
        </div>`,
      });

      blockManager.add("faq-accordion", {
        label: "FAQ Accordion",
        category: "B2B Manufacturer Blocks",
        content: `<div style="width: 100%; margin: 20px 0; display: flex; flex-direction: column; gap: 12px; font-family: sans-serif;">
          <div style="background: #081a33; border: 1px solid #0f2545; border-radius: 12px; padding: 16px;">
            <h4 style="color: #ffffff; font-weight: bold; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-size: 14px;">
              <span>What is your typical bulk order MOQ?</span>
              <span style="color: #d4a574;">+</span>
            </h4>
            <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 0;">Our standard MOQ starts at 500 pieces per style/colorway, perfect for capsule collections and high-growth retail brands.</p>
          </div>
          <div style="background: #081a33; border: 1px solid #0f2545; border-radius: 12px; padding: 16px;">
            <h4 style="color: #ffffff; font-weight: bold; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-size: 14px;">
              <span>What is the standard sample lead time?</span>
              <span style="color: #d4a574;">+</span>
            </h4>
            <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 0;">Prototyping and sampling generally takes 7 to 10 business days depending on design specs.</p>
          </div>
        </div>`,
      });

      blockManager.add("contact-info-card", {
        label: "Contact Card",
        category: "B2B Manufacturer Blocks",
        content: `<div style="background: #081a33; border: 1px solid #0f2545; border-radius: 20px; padding: 30px; margin: 20px 0; width: 100%; max-width: 450px; font-family: sans-serif;">
          <h3 style="color: #ffffff; font-weight: 800; font-size: 20px; margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #0f2545; padding-bottom: 10px;">QSA Apparels Dhaka HQ</h3>
          <p style="color: #cbd5e1; font-size: 13px; margin-bottom: 12px;">📍 Mirpur DOHS, House 45, Road 12, Dhaka, Bangladesh</p>
          <p style="color: #cbd5e1; font-size: 13px; margin-bottom: 12px;">📞 +88 017 367 55 829</p>
          <p style="color: #cbd5e1; font-size: 13px; margin-bottom: 20px;">✉️ wasi@qsaapparels.com</p>
          <div style="display: flex; gap: 12px;">
            <a href="#" style="background: #0b2545; color: #d4a574; font-weight: bold; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 11px;">LinkedIn</a>
            <a href="#" style="background: #0b2545; color: #d4a574; font-weight: bold; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 11px;">Facebook</a>
          </div>
        </div>`,
      });

      blockManager.add("moq-lead-card", {
        label: "MOQ & Lead Specs",
        category: "B2B Manufacturer Blocks",
        content: `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; width: 100%; margin: 20px 0; font-family: sans-serif;">
          <div style="background: rgba(212, 165, 116, 0.05); border: 1px solid #d4a574; border-radius: 16px; padding: 20px; text-align: center;">
            <span style="font-size: 28px; font-weight: bold; color: #d4a574; display: block; margin-bottom: 4px;">500 Pcs</span>
            <span style="font-size: 10px; font-weight: bold; color: #94a3b8; text-transform: uppercase;">Flexible Low MOQ Sourcing</span>
          </div>
          <div style="background: rgba(212, 165, 116, 0.05); border: 1px solid #d4a574; border-radius: 16px; padding: 20px; text-align: center;">
            <span style="font-size: 28px; font-weight: bold; color: #d4a574; display: block; margin-bottom: 4px;">30-45 Days</span>
            <span style="font-size: 10px; font-weight: bold; color: #94a3b8; text-transform: uppercase;">Efficient Bulk Turnaround</span>
          </div>
        </div>`,
      });

      blockManager.add("rfq-quote-form", {
        label: "RFQ Quote Form",
        category: "B2B Manufacturer Blocks",
        content: `<div style="background: #081a33; border: 1px solid #0f2545; border-radius: 20px; padding: 30px; margin: 30px 0; width: 100%; text-align: left; font-family: sans-serif;">
          <h3 style="color:#ffffff; font-weight:800; font-size:22px; margin-top:0; margin-bottom:8px;">Request a Custom B2B Quote</h3>
          <p style="color:#94a3b8; font-size:12px; margin-bottom:24px;">Send us your product quantities, styles, and fabric specs to receive factory pricing within 24 hours.</p>
          <div style="display:flex; flex-direction:column; gap:16px;">
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
              <input type="text" placeholder="Company Name" style="background:#040d1a; border:1px solid #0f2545; padding:12px; border-radius:8px; color:white; font-size:12px; width:100%; box-sizing:border-box;" />
              <input type="email" placeholder="Business Email" style="background:#040d1a; border:1px solid #0f2545; padding:12px; border-radius:8px; color:white; font-size:12px; width:100%; box-sizing:border-box;" />
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
              <input type="text" placeholder="Product Type" style="background:#040d1a; border:1px solid #0f2545; padding:12px; border-radius:8px; color:white; font-size:12px; width:100%; box-sizing:border-box;" />
              <input type="number" placeholder="Target Quantity" style="background:#040d1a; border:1px solid #0f2545; padding:12px; border-radius:8px; color:white; font-size:12px; width:100%; box-sizing:border-box;" />
            </div>
            <textarea placeholder="Message & Detailed Spec Highlights..." rows="4" style="background:#040d1a; border:1px solid #0f2545; padding:12px; border-radius:8px; color:white; font-size:12px; width:100%; box-sizing:border-box; resize:none;"></textarea>
            <button type="button" style="background:#d4a574; color:#040d1a; font-weight:bold; padding:12px; border-radius:8px; border:none; cursor:pointer; font-size:12px; text-transform:uppercase;">Submit RFQ Request</button>
          </div>
        </div>`,
      });

      blockManager.add("newsletter-form", {
        label: "Newsletter Signup",
        category: "B2B Manufacturer Blocks",
        content: `<div style="background: #081a33; border: 1px solid #0f2545; border-radius: 20px; padding: 30px; text-align: center; width: 100%; margin: 20px 0; font-family: sans-serif;">
          <h4 style="color:#ffffff; font-weight:800; font-size:18px; margin-top:0; margin-bottom:6px;">Stay Tuned for Sourcing Updates</h4>
          <p style="color:#94a3b8; font-size:11px; margin-bottom:20px;">Receive global RMG pricing trends and certified sustainability updates.</p>
          <div style="display:flex; justify-content:center; gap:8px; max-width:400px; margin:0 auto; flex-wrap: wrap;">
            <input type="email" placeholder="Your corporate email" style="background:#040d1a; border:1px solid #0f2545; padding:10px 16px; border-radius:8px; color:white; font-size:12px; flex:1; min-width: 200px;" />
            <button type="button" style="background:#d4a574; color:#040d1a; font-weight:bold; border:none; padding:10px 20px; border-radius:8px; cursor:pointer; font-size:12px;">Subscribe</button>
          </div>
        </div>`,
      });

      // === DYNAMIC BLOCKS ===
      blockManager.add("dynamic-products", {
        label: "Dynamic Products",
        category: "B2B Dynamic Components",
        content: `<div data-component="featured-products" data-count="4" data-featured="true" style="padding: 40px; border: 2px dashed #d4a574; border-radius: 16px; text-align: center; background: rgba(212, 165, 116, 0.05); margin: 30px 0; font-family: sans-serif;">
          <h3 style="color: #d4a574; font-weight: bold; margin-bottom: 8px;">🌐 DYNAMIC PRODUCTS CAROUSEL</h3>
          <p style="color: #94a3b8; font-size: 12px;">This block dynamically pulls active, featured products from your MongoDB database when visitors load the page.</p>
        </div>`,
      });

      blockManager.add("dynamic-categories", {
        label: "Dynamic Categories",
        category: "B2B Dynamic Components",
        content: `<div data-component="product-categories" data-count="6" style="padding: 40px; border: 2px dashed #d4a574; border-radius: 16px; text-align: center; background: rgba(212, 165, 116, 0.05); margin: 30px 0; font-family: sans-serif;">
          <h3 style="color: #d4a574; font-weight: bold; margin-bottom: 8px;">🌐 DYNAMIC CATEGORIES GRID</h3>
          <p style="color: #94a3b8; font-size: 12px;">This block dynamically pulls garment product directories (T-Shirts, Polos, Hoodies, Trousers etc.) from your database when rendered.</p>
        </div>`,
      });

      blockManager.add("dynamic-blogs", {
        label: "Dynamic Latest Blogs",
        category: "B2B Dynamic Components",
        content: `<div data-component="latest-blogs" data-count="3" style="padding: 40px; border: 2px dashed #d4a574; border-radius: 16px; text-align: center; background: rgba(212, 165, 116, 0.05); margin: 30px 0; font-family: sans-serif;">
          <h3 style="color: #d4a574; font-weight: bold; margin-bottom: 8px;">🌐 DYNAMIC BLOG POSTS</h3>
          <p style="color: #94a3b8; font-size: 12px;">This block dynamically displays the latest industry insights and apparel factory news posts.</p>
        </div>`,
      });

      // 4. Load GrapesJS data if it exists in DB
      if (pageData.gjsData) {
        try {
          const parsed = JSON.parse(pageData.gjsData);
          editor.loadProjectData(parsed);
        } catch (e) {
          console.warn("Failed to load GrapesJS project state:", e);
        }
      } else if (pageData.slug && pageData.slug.startsWith("products/")) {
        // Prepare beautiful initial product page template using dynamic database specs
        const productName = pageData.title || "Product Design Workspace";
        const productDescription = pageData.content || "<p>Premium grade export apparel catalog item. Double click to add custom descriptions.</p>";
        const productMoq = pageData.moq || "500 pieces per style";
        const productLeadTime = pageData.leadTime || "30 - 45 days";
        const productFabric = pageData.fabric || "100% Premium Combed Cotton / customizable blends";
        const productSizes = pageData.sizes || "XS, S, M, L, XL, XXL (Custom sizing spec sheets)";
        const productColors = pageData.colors || "Custom dyed matching Pantone references";
        
        // Dynamic images handling
        const imagesList = pageData.images || [];
        const mainImageUrl = imagesList[0]?.url || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800";
        
        const thumbnailImagesHtml = imagesList.map((img: any) => `
          <div style="background: #081a33; border: 1px solid #0f2545; border-radius: 12px; padding: 4px; display: flex; justify-content: center; align-items: center; overflow: hidden; cursor: pointer; aspect-ratio: 1/1;">
            <img src="${img.url}" alt="${img.alt || productName}" style="max-width: 100%; max-height: 100%; border-radius: 8px; object-fit: cover;" />
          </div>
        `).join("");

        const templatedHtml = `
          <section style="padding: 60px 20px; background-color: #040d1a; min-height: 100vh; font-family: 'Inter', sans-serif; color: #ffffff; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; width: 100%;">
            <div style="max-width: 1200px; width: 100%; margin: 0 auto; display: flex; flex-direction: column; gap: 40px;">
              
              <!-- Hero Block: Image & Meta Info -->
              <div style="display: flex; flex-wrap: wrap; gap: 40px; width: 100%;">
                <!-- Left Column: Image -->
                <div style="flex: 1.2; min-width: 300px; display: flex; flex-direction: column; gap: 20px;">
                  <div style="background: #081a33; border: 1px solid #0f2545; border-radius: 24px; padding: 15px; display: flex; justify-content: center; align-items: center; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4);">
                    <img src="${mainImageUrl}" alt="${productName}" style="max-width: 100%; height: auto; border-radius: 16px; object-fit: cover;" />
                  </div>
                  
                  <!-- Thumbnail Grid -->
                  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; width: 100%;">
                    ${thumbnailImagesHtml || `
                      <div style="background: #081a33; border: 1px solid #0f2545; border-radius: 12px; padding: 4px; display: flex; justify-content: center; align-items: center; overflow: hidden; cursor: pointer; aspect-ratio: 1/1;">
                        <img src="${mainImageUrl}" style="max-width: 100%; max-height: 100%; border-radius: 8px; object-fit: cover;" />
                      </div>
                    `}
                  </div>
                </div>
                
                <!-- Right Column: Specs & B2B Details -->
                <div style="flex: 1; min-width: 300px; display: flex; flex-direction: column; gap: 24px; justify-content: flex-start;">
                  <div>
                    <span style="color: #d4a574; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; display: inline-block; margin-bottom: 8px;">Premium Apparel Catalog</span>
                    <h1 style="color: #ffffff; font-size: 38px; font-weight: 800; margin: 0 0 16px 0; line-height: 1.2; letter-spacing: -0.02em;">${productName}</h1>
                    <div style="width: 60px; height: 3px; background: #d4a574; border-radius: 2px;"></div>
                  </div>

                  <div style="background: #081a33; border: 1px solid #0f2545; border-radius: 20px; padding: 24px; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
                    <h3 style="color: #d4a574; font-size: 14px; font-weight: bold; text-transform: uppercase; margin: 0; letter-spacing: 0.05em;">B2B Supply Specifications</h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr; gap: 12px;">
                      <!-- MOQ -->
                      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(15, 37, 69, 0.6); padding-bottom: 8px;">
                        <span style="color: #94a3b8; font-size: 13px;">Minimum Order Qty (MOQ)</span>
                        <span style="color: #ffffff; font-weight: 600; font-size: 14px;">${productMoq}</span>
                      </div>
                      <!-- Lead Time -->
                      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(15, 37, 69, 0.6); padding-bottom: 8px;">
                        <span style="color: #94a3b8; font-size: 13px;">Lead Time</span>
                        <span style="color: #ffffff; font-weight: 600; font-size: 14px;">${productLeadTime}</span>
                      </div>
                      <!-- Fabric -->
                      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(15, 37, 69, 0.6); padding-bottom: 8px;">
                        <span style="color: #94a3b8; font-size: 13px;">Fabric / Composition</span>
                        <span style="color: #ffffff; font-weight: 600; font-size: 14px;">${productFabric}</span>
                      </div>
                      <!-- Sizes -->
                      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(15, 37, 69, 0.6); padding-bottom: 8px;">
                        <span style="color: #94a3b8; font-size: 13px;">Available Sizes</span>
                        <span style="color: #ffffff; font-weight: 600; font-size: 14px;">${productSizes}</span>
                      </div>
                      <!-- Colors -->
                      <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 4px;">
                        <span style="color: #94a3b8; font-size: 13px;">Colors</span>
                        <span style="color: #ffffff; font-weight: 600; font-size: 14px;">${productColors}</span>
                      </div>
                    </div>
                  </div>

                  <div style="display: flex; gap: 16px; width: 100%;">
                    <a href="#rfq-section" style="flex: 1; text-align: center; background: #d4a574; color: #040d1a; font-weight: bold; font-size: 14px; padding: 16px; border-radius: 12px; text-decoration: none; transition: all 0.3s ease; box-shadow: 0 10px 20px rgba(212, 165, 116, 0.15);">Request Custom Quote</a>
                    <a href="/contacts" style="flex: 0.8; text-align: center; background: #0b2545; border: 1px solid #0f2545; color: #d4a574; font-weight: bold; font-size: 14px; padding: 16px; border-radius: 12px; text-decoration: none;">Contact Supplier</a>
                  </div>
                </div>
              </div>

              <!-- Description Block -->
              <div style="background: #081a33; border: 1px solid #0f2545; border-radius: 24px; padding: 35px; width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
                <h2 style="color: #ffffff; font-size: 24px; font-weight: 700; margin-top: 0; margin-bottom: 20px; border-bottom: 1px solid #0f2545; padding-bottom: 12px; display: flex; align-items: center; gap: 10px;">
                  <span style="color: #d4a574;">■</span> Product Specifications & Details
                </h2>
                <div style="color: #94a3b8; font-size: 16px; line-height: 1.8; font-family: 'Inter', sans-serif;">
                  ${productDescription}
                </div>
              </div>

              <!-- Accreditations & Badges trust block -->
              <div style="padding: 24px; background: rgba(8, 26, 51, 0.4); border-radius: 16px; border: 1px solid #0f2545; width: 100%; display: flex; justify-content: space-around; align-items: center; gap: 20px; flex-wrap: wrap; text-align: center;">
                <div style="flex: 1; min-width: 150px;">
                  <span style="color: #d4a574; font-size: 18px; font-weight: 800; display: block; margin-bottom: 2px;">BSCI</span>
                  <span style="color: #64748b; font-size: 10px; font-weight: bold; text-transform: uppercase;">Social Compliance</span>
                </div>
                <div style="flex: 1; min-width: 150px; border-left: 1px solid #0f2545;">
                  <span style="color: #d4a574; font-size: 18px; font-weight: 800; display: block; margin-bottom: 2px;">OEKO-TEX</span>
                  <span style="color: #64748b; font-size: 10px; font-weight: bold; text-transform: uppercase;">Standard 100 Certified</span>
                </div>
                <div style="flex: 1; min-width: 150px; border-left: 1px solid #0f2545;">
                  <span style="color: #d4a574; font-size: 18px; font-weight: 800; display: block; margin-bottom: 2px;">SEDEX</span>
                  <span style="color: #64748b; font-size: 10px; font-weight: bold; text-transform: uppercase;">Responsible Supply Chain</span>
                </div>
              </div>

              <!-- RFQ Quote Form Section -->
              <div id="rfq-section" style="background: #081a33; border: 1px solid #0f2545; border-radius: 24px; padding: 40px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
                <h3 style="color:#ffffff; font-weight:800; font-size:24px; margin-top:0; margin-bottom:8px;">Request a Custom B2B Quote</h3>
                <p style="color:#94a3b8; font-size:14px; margin-bottom:28px;">Specify your custom design, printing, fabric blend, and quantity requirements for this specific item.</p>
                
                <div style="display:flex; flex-direction:column; gap:16px;">
                  <div style="display:flex; gap:16px; flex-wrap: wrap; width:100%;">
                    <input type="text" placeholder="Company Name" style="background:#040d1a; border:1px solid #0f2545; padding:14px; border-radius:10px; color:white; font-size:13px; flex:1; min-width:200px; box-sizing:border-box;" />
                    <input type="email" placeholder="Business Email" style="background:#040d1a; border:1px solid #0f2545; padding:14px; border-radius:10px; color:white; font-size:13px; flex:1; min-width:200px; box-sizing:border-box;" />
                  </div>
                  <div style="display:flex; gap:16px; flex-wrap: wrap; width:100%;">
                    <input type="text" placeholder="Product Interest" value="${productName}" style="background:#040d1a; border:1px solid #0f2545; padding:14px; border-radius:10px; color:white; font-size:13px; flex:1; min-width:200px; box-sizing:border-box;" />
                    <input type="number" placeholder="Target Quantity" style="background:#040d1a; border:1px solid #0f2545; padding:14px; border-radius:10px; color:white; font-size:13px; flex:1; min-width:200px; box-sizing:border-box;" />
                  </div>
                  <textarea placeholder="Tell us more about your target fabric weight, customized logo/labels, packaging specs, or delivery destinations..." rows="5" style="background:#040d1a; border:1px solid #0f2545; padding:14px; border-radius:10px; color:white; font-size:13px; width:100%; box-sizing:border-box; resize:none;"></textarea>
                  <button type="button" style="background:#d4a574; color:#040d1a; font-weight:800; padding:14px; border-radius:10px; border:none; cursor:pointer; font-size:13px; text-transform:uppercase; letter-spacing:0.05em; transition: all 0.2s; width:100%;">Submit RFQ Quote Request</button>
                </div>
              </div>

            </div>
          </section>
        `;
        editor.setComponents(templatedHtml);
      } else if (pageData.content) {
        // Fallback to import raw HTML
        editor.setComponents(pageData.content);
      }
    });

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [isLoading, pageData]);

  // 3. Save GrapesJS edits back to database
  const handleSave = async () => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    const html = editor.getHtml();
    const css = editor.getCss();
    const gjsData = JSON.stringify(editor.getProjectData());

    try {
      const res = await fetch(`/api/pages?id=${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gjsHtml: html,
          gjsCss: css,
          gjsData: gjsData,
          isBuilderPage: true,
          content: html // Sync content with visual builder HTML output
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Save error occurred");
      }

      toast.success("Page designs successfully saved and published!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save visual designs");
    }
  };

  // 4. Toggle Editor Canvas Device View
  const handleDeviceChange = (device: string) => {
    if (!editorRef.current) return;
    editorRef.current.setDevice(device);
    setActiveDevice(device);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#040d1a] gap-4">
        <Loader2 className="w-10 h-10 text-[#d4a574] animate-spin" />
        <span className="text-slate-400 text-sm font-semibold">Initializing Elementor Pro-style Visual Workspace...</span>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#040d1a]">
      {/* Visual Editor Header Workspace */}
      <header className="h-16 border-b border-[#0f2545] bg-[#081a33]/90 flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(pageData?.slug?.startsWith("products/") ? "/admin/products" : "/admin/pages")}
            className="p-2 rounded-lg bg-[#0b2545] text-slate-400 hover:text-white border border-[#0f2545] cursor-pointer hover:border-slate-500 transition-premium flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Exit Editor
          </button>
          <div className="h-4 w-[1px] bg-[#0f2545]" />
          <span className="text-white text-sm font-bold font-heading">
            Editing page: <span className="text-[#d4a574]">/{pageData?.slug}</span>
          </span>
        </div>

        {/* Responsive layout preview options */}
        <div className="flex items-center bg-[#040d1a]/80 border border-[#0f2545] p-1 rounded-xl gap-1">
          <button
            onClick={() => handleDeviceChange("desktop")}
            className={`p-1.5 rounded-lg cursor-pointer transition-premium ${
              activeDevice === "desktop" ? "bg-[#d4a574] text-[#040d1a]" : "text-slate-500 hover:text-white"
            }`}
            title="Desktop Canvas"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeviceChange("tablet")}
            className={`p-1.5 rounded-lg cursor-pointer transition-premium ${
              activeDevice === "tablet" ? "bg-[#d4a574] text-[#040d1a]" : "text-slate-500 hover:text-white"
            }`}
            title="Tablet Canvas"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeviceChange("mobile")}
            className={`p-1.5 rounded-lg cursor-pointer transition-premium ${
              activeDevice === "mobile" ? "bg-[#d4a574] text-[#040d1a]" : "text-slate-500 hover:text-white"
            }`}
            title="Mobile Canvas"
          >
            <Phone className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href={pageData?.slug === "home" ? "/" : `/${pageData?.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#0b2545] hover:bg-[#0f2545] text-slate-300 hover:text-white transition-premium cursor-pointer border border-[#0f2545] flex items-center gap-1.5 text-xs font-semibold"
          >
            <Eye className="w-4 h-4" /> Live Preview
          </a>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#d4a574] hover:bg-[#c29463] text-[#040d1a] transition-premium cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-lg"
          >
            <Save className="w-4 h-4" /> Save & Publish
          </button>
        </div>
      </header>

      {/* Elementor Pro Custom styling and Left sidebar layout override */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Swap sidebars: Panel on the left, canvas on the right */
        .gjs-editor {
          flex-direction: row-reverse !important;
          background-color: #040d1a !important;
        }
        
        /* Sidebar container styles */
        .gjs-pn-views-container {
          left: 0 !important;
          right: auto !important;
          border-right: 1px solid #0f2545 !important;
          border-left: none !important;
          background-color: #081a33 !important;
          width: 320px !important;
          box-shadow: 4px 0 25px rgba(0, 0, 0, 0.4) !important;
          color: #f1f5f9 !important;
        }

        .gjs-pn-views {
          left: 0 !important;
          right: auto !important;
          background-color: #040d1a !important;
          border-right: 1px solid #0f2545 !important;
        }

        /* Customize tab panels and icons */
        .gjs-pn-btn {
          color: #94a3b8 !important;
          transition: all 0.2s ease !important;
        }

        .gjs-pn-btn:hover {
          color: #ffffff !important;
          background-color: #0b2545 !important;
        }

        .gjs-pn-btn.gjs-pn-active {
          color: #040d1a !important;
          background-color: #d4a574 !important;
          box-shadow: 0 4px 10px rgba(212, 165, 116, 0.2) !important;
        }

        /* Search / Headings inside panels */
        .gjs-sm-sector-title, .gjs-block-category .gjs-title {
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          color: #d4a574 !important;
          background-color: #081a33 !important;
          border-bottom: 1px solid #0f2545 !important;
        }

        .gjs-block-category {
          border-bottom: 1px solid #0f2545 !important;
          background-color: #081a33 !important;
        }

        /* Widgets grid styling */
        .gjs-blocks-c {
          background-color: #040d1a !important;
          padding: 16px !important;
          display: grid !important;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 12px !important;
        }

        .gjs-block {
          background-color: #081a33 !important;
          border: 1px solid #0f2545 !important;
          color: #cbd5e1 !important;
          border-radius: 12px !important;
          padding: 16px 8px !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          height: auto !important;
          min-height: 85px !important;
          width: auto !important;
          cursor: grab !important;
          transition: all 0.2s ease-in-out !important;
        }

        .gjs-block:hover {
          border-color: #d4a574 !important;
          color: #ffffff !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(212, 165, 116, 0.15) !important;
          background-color: #0b2545 !important;
        }

        .gjs-block-label {
          font-size: 10px !important;
          font-weight: 600 !important;
          text-align: center !important;
          line-height: 1.2 !important;
        }

        /* Canvas background override */
        .gjs-cv-canvas {
          background-color: #040d1a !important;
          width: 100% !important;
          height: 100% !important;
        }

        /* Style manager inputs */
        .gjs-sm-field input, .gjs-sm-field select, .gjs-sm-field textarea {
          background-color: #040d1a !important;
          border: 1px solid #0f2545 !important;
          color: #ffffff !important;
          border-radius: 6px !important;
        }

        .gjs-sm-field {
          background-color: #040d1a !important;
          border: 1px solid #0f2545 !important;
          border-radius: 6px !important;
        }

        .gjs-sm-sector {
          border-bottom: 1px solid #0f2545 !important;
        }

        /* Device Manager buttons position fix */
        .gjs-pn-devices-c {
          display: none !important; /* Managed by custom UI in header */
        }
      ` }} />

      {/* Editor Canvas Canvas Mount */}
      <div className="flex-1 w-full relative" ref={containerRef}>
        <div id="gjs" className="bg-[#040d1a] text-white" />
      </div>
    </div>
  );
}
