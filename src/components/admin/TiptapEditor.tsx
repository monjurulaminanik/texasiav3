"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Undo,
  Redo,
  Quote,
} from "lucide-react";
import { toast } from "sonner";

interface TiptapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({
  value = "",
  onChange,
  placeholder = "Write premium B2B corporate garment copy here...",
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#d4a574] hover:underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-xl border border-[#0f2545]",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse table-auto w-full border border-[#0f2545] my-4 text-sm text-left",
        },
      }),
      TableRow,
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-[#0f2545] p-2 text-slate-300",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-[#0f2545] p-2 bg-[#081a33] font-semibold text-white",
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("Enter the URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter the Image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
    toast.success("Inserted a 3x3 table!");
  };

  return (
    <div className="border border-[#0f2545] rounded-2xl overflow-hidden bg-[#040d1a]/50">
      {/* Editor Toolbar */}
      <div className="bg-[#081a33]/60 border-b border-[#0f2545] p-3 flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded-lg transition-premium cursor-pointer ${
            editor.isActive("bold")
              ? "bg-[#d4a574] text-[#040d1a]"
              : "text-slate-400 hover:bg-[#0b2545] hover:text-white"
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded-lg transition-premium cursor-pointer ${
            editor.isActive("italic")
              ? "bg-[#d4a574] text-[#040d1a]"
              : "text-slate-400 hover:bg-[#0b2545] hover:text-white"
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <span className="w-[1px] h-6 bg-[#0f2545] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded-lg transition-premium cursor-pointer ${
            editor.isActive("heading", { level: 2 })
              ? "bg-[#d4a574] text-[#040d1a]"
              : "text-slate-400 hover:bg-[#0b2545] hover:text-white"
          }`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded-lg transition-premium cursor-pointer ${
            editor.isActive("heading", { level: 3 })
              ? "bg-[#d4a574] text-[#040d1a]"
              : "text-slate-400 hover:bg-[#0b2545] hover:text-white"
          }`}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <span className="w-[1px] h-6 bg-[#0f2545] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded-lg transition-premium cursor-pointer ${
            editor.isActive("bulletList")
              ? "bg-[#d4a574] text-[#040d1a]"
              : "text-slate-400 hover:bg-[#0b2545] hover:text-white"
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded-lg transition-premium cursor-pointer ${
            editor.isActive("orderedList")
              ? "bg-[#d4a574] text-[#040d1a]"
              : "text-slate-400 hover:bg-[#0b2545] hover:text-white"
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded-lg transition-premium cursor-pointer ${
            editor.isActive("blockquote")
              ? "bg-[#d4a574] text-[#040d1a]"
              : "text-slate-400 hover:bg-[#0b2545] hover:text-white"
          }`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <span className="w-[1px] h-6 bg-[#0f2545] mx-1" />

        <button
          type="button"
          onClick={addLink}
          className={`p-2 rounded-lg transition-premium cursor-pointer ${
            editor.isActive("link")
              ? "bg-[#d4a574] text-[#040d1a]"
              : "text-slate-400 hover:bg-[#0b2545] hover:text-white"
          }`}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded-lg transition-premium cursor-pointer text-slate-400 hover:bg-[#0b2545] hover:text-white"
          title="Add Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={addTable}
          className="p-2 rounded-lg transition-premium cursor-pointer text-slate-400 hover:bg-[#0b2545] hover:text-white"
          title="Insert Table"
        >
          <TableIcon className="w-4 h-4" />
        </button>

        <span className="w-[1px] h-6 bg-[#0f2545] mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded-lg transition-premium cursor-pointer text-slate-400 hover:bg-[#0b2545] hover:text-white disabled:opacity-30"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded-lg transition-premium cursor-pointer text-slate-400 hover:bg-[#0b2545] hover:text-white disabled:opacity-30"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <div className="p-4 min-h-[300px] max-h-[500px] overflow-y-auto prose prose-invert max-w-none text-slate-200 focus:outline-none">
        <EditorContent editor={editor} className="outline-none" />
      </div>
    </div>
  );
}
