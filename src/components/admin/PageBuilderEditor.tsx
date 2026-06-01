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
        label: "<b>Layout: Section</b>",
        category: "Layout Components",
        content: `<section style="padding: 60px 20px; background-color: #040d1a; min-height: 150px; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
          <div style="max-width: 1200px; width: 100%; margin: 0 auto;">
            <p style="text-align: center; color: #94a3b8;">Drag content widgets inside this container...</p>
          </div>
        </section>`,
      });

      blockManager.add("column-2", {
        label: "<b>Layout: 2-Columns</b>",
        category: "Layout Components",
        content: `<div style="display: flex; flex-wrap: wrap; gap: 20px; width: 100%; margin: 20px 0;">
          <div style="flex: 1; min-width: 300px; padding: 20px; border: 1px dashed rgba(212, 165, 116, 0.2); border-radius: 8px;">
            <h3>Column 1</h3>
            <p>Drag elements here...</p>
          </div>
          <div style="flex: 1; min-width: 300px; padding: 20px; border: 1px dashed rgba(212, 165, 116, 0.2); border-radius: 8px;">
            <h3>Column 2</h3>
            <p>Drag elements here...</p>
          </div>
        </div>`,
      });

      blockManager.add("column-3", {
        label: "<b>Layout: 3-Columns</b>",
        category: "Layout Components",
        content: `<div style="display: flex; flex-wrap: wrap; gap: 20px; width: 100%; margin: 20px 0;">
          <div style="flex: 1; min-width: 200px; padding: 15px; border: 1px dashed rgba(212, 165, 116, 0.2); border-radius: 8px;">
            <h3>Col 1</h3>
          </div>
          <div style="flex: 1; min-width: 200px; padding: 15px; border: 1px dashed rgba(212, 165, 116, 0.2); border-radius: 8px;">
            <h3>Col 2</h3>
          </div>
          <div style="flex: 1; min-width: 200px; padding: 15px; border: 1px dashed rgba(212, 165, 116, 0.2); border-radius: 8px;">
            <h3>Col 3</h3>
          </div>
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

      // === B2B BUSINESS BLOCKS ===
      blockManager.add("hero-banner", {
        label: "<b>Hero Banner Widget</b>",
        category: "B2B Manufacturer Blocks",
        content: `<div style="padding: 100px 20px; background-image: linear-gradient(135deg, #040d1a 0%, #081a33 100%); text-align: center; border-radius: 24px; border: 1px solid #0f2545; width: 100%; margin: 30px 0;">
          <span style="color: #d4a574; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">Certified B2B Garment Factory</span>
          <h1 style="color: #ffffff; font-size: 48px; font-weight: 900; margin-top: 10px; margin-bottom: 20px;">Custom Sourcing and Apparel Manufacturing</h1>
          <p style="color: #94a3b8; font-size: 18px; max-w: 600px; margin: 0 auto 30px auto; line-height: 1.6;">LEED Gold certified factories in Bangladesh delivering custom OEM/ODM products with flexible 500 pcs MOQ.</p>
          <a href="/request-for-quotation" style="display: inline-block; background: #d4a574; color: #040d1a; padding: 14px 32px; border-radius: 12px; font-weight: bold; text-decoration: none;">Request Free Quote</a>
        </div>`,
      });

      blockManager.add("stats-counter", {
        label: "<b>Stats Counter Grid</b>",
        category: "B2B Manufacturer Blocks",
        content: `<div style="display: flex; flex-wrap: wrap; justify-content: space-around; gap: 20px; width: 100%; padding: 40px; background: rgba(8, 26, 51, 0.4); border: 1px solid #0f2545; border-radius: 20px; margin: 30px 0; text-align: center;">
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
        label: "<b>Certification Badge Strip</b>",
        category: "B2B Manufacturer Blocks",
        content: `<div style="padding: 20px; background: #040d1a; border-radius: 12px; border: 1px solid #0f2545; width: 100%; margin: 20px 0; display: flex; justify-content: center; align-items: center; gap: 40px; flex-wrap: wrap;">
          <span style="color: #64748b; font-weight: bold; font-size: 12px; text-transform: uppercase;">Accredited By:</span>
          <span style="color: #ffffff; font-weight: 900; font-size: 16px; border: 1px solid #0f2545; padding: 4px 12px; border-radius: 6px;">BSCI</span>
          <span style="color: #ffffff; font-weight: 900; font-size: 16px; border: 1px solid #0f2545; padding: 4px 12px; border-radius: 6px;">SEDEX</span>
          <span style="color: #ffffff; font-weight: 900; font-size: 16px; border: 1px solid #0f2545; padding: 4px 12px; border-radius: 6px;">WRAP</span>
          <span style="color: #ffffff; font-weight: 900; font-size: 16px; border: 1px solid #0f2545; padding: 4px 12px; border-radius: 6px;">OEKO-TEX</span>
        </div>`,
      });

      // === DYNAMIC BLOCKS ===
      blockManager.add("dynamic-products", {
        label: "<b>🌐 Dynamic Products Grid</b>",
        category: "B2B Dynamic Components",
        content: `<div data-component="featured-products" data-count="4" data-featured="true" style="padding: 40px; border: 2px dashed #d4a574; border-radius: 16px; text-align: center; background: rgba(212, 165, 116, 0.05); margin: 30px 0;">
          <h3 style="color: #d4a574; font-weight: bold; margin-bottom: 8px;">🌐 DYNAMIC PRODUCTS CAROUSEL</h3>
          <p style="color: #94a3b8; font-size: 12px;">This block dynamically pulls active, featured products from your MongoDB database when visitors load the page. You can customize visual layout traits like count in the public view.</p>
        </div>`,
      });

      blockManager.add("dynamic-categories", {
        label: "<b>🌐 Dynamic Category Grid</b>",
        category: "B2B Dynamic Components",
        content: `<div data-component="product-categories" data-count="6" style="padding: 40px; border: 2px dashed #d4a574; border-radius: 16px; text-align: center; background: rgba(212, 165, 116, 0.05); margin: 30px 0;">
          <h3 style="color: #d4a574; font-weight: bold; margin-bottom: 8px;">🌐 DYNAMIC CATEGORIES GRID</h3>
          <p style="color: #94a3b8; font-size: 12px;">This block dynamically pulls garment product directories (T-Shirts, Polos, Hoodies, Trousers etc.) from your database when rendered.</p>
        </div>`,
      });

      blockManager.add("dynamic-blogs", {
        label: "<b>🌐 Dynamic Latest Blogs</b>",
        category: "B2B Dynamic Components",
        content: `<div data-component="latest-blogs" data-count="3" style="padding: 40px; border: 2px dashed #d4a574; border-radius: 16px; text-align: center; background: rgba(212, 165, 116, 0.05); margin: 30px 0;">
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
            onClick={() => router.push("/admin/pages")}
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

      {/* Editor Canvas Canvas Mount */}
      <div className="flex-1 w-full relative" ref={containerRef}>
        <div id="gjs" className="bg-[#040d1a] text-white" />
      </div>
    </div>
  );
}
