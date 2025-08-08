"use client";
import React, { useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Code from "@tiptap/extension-code";
import Heading from "@tiptap/extension-heading";
import Image from "@tiptap/extension-image";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export default function RichTextEditor({ value, onChange, label }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Code,
      Heading.configure({ levels: [1, 2, 3] }),
      Image,
      HorizontalRule,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      Color,
      Highlight,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  if (!editor) return null;

  // Helper for image upload
  const insertImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      editor.chain().focus().setImage({ src: reader.result as string }).run();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mb-10">
      {label && <label className="block text-2xl font-bold mb-3">{label}</label>}
      <div className="border rounded-md p-2 bg-white">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 mb-2 items-center">
          <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-blue-200 text-blue-700 font-bold px-2 py-1 rounded' : 'px-2 py-1 rounded'}><b>B</b></button>
          <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-blue-200 text-blue-700 font-bold px-2 py-1 rounded' : 'px-2 py-1 rounded'}><i>I</i></button>
          <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'bg-blue-200 text-blue-700 font-bold px-2 py-1 rounded' : 'px-2 py-1 rounded'}><u>U</u></button>
          <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'bg-blue-200 text-blue-700 font-bold px-2 py-1 rounded' : 'px-2 py-1 rounded'}><s>S</s></button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'bg-blue-200 text-blue-700 font-bold px-2 py-1 rounded' : 'px-2 py-1 rounded'}>H1</button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-blue-200 text-blue-700 font-bold px-2 py-1 rounded' : 'px-2 py-1 rounded'}>H2</button>
          <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'bg-blue-200 text-blue-700 font-bold px-2 py-1 rounded' : 'px-2 py-1 rounded'}>H3</button>
          <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-blue-200 text-blue-700 font-bold px-2 py-1 rounded' : 'px-2 py-1 rounded'}>• List</button>
          <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'bg-blue-200 text-blue-700 font-bold px-2 py-1 rounded' : 'px-2 py-1 rounded'}>1. List</button>
          <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={editor.isActive('code') ? 'bg-blue-200 text-blue-700 font-bold px-2 py-1 rounded' : 'px-2 py-1 rounded'}>{"< >"}</button>
          <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className="px-2 py-1 rounded">―</button>
          {/* Text align */}
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'bg-blue-200 text-blue-700 font-bold px-2 py-1 rounded' : 'px-2 py-1 rounded'}>L</button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'bg-blue-200 text-blue-700 font-bold px-2 py-1 rounded' : 'px-2 py-1 rounded'}>C</button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'bg-blue-200 text-blue-700 font-bold px-2 py-1 rounded' : 'px-2 py-1 rounded'}>R</button>
          <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-200 text-blue-700 font-bold px-2 py-1 rounded' : 'px-2 py-1 rounded'}>J</button>
          {/* Color/Highlight */}
          <input
            type="color"
            onChange={e => editor.chain().focus().setColor(e.target.value).run()}
            className="w-8 h-8 border-none p-0 bg-transparent cursor-pointer"
            title="Text color"
          />
          <input
            type="color"
            onChange={e => editor.chain().focus().setHighlight({ color: e.target.value }).run()}
            className="w-8 h-8 border-none p-0 bg-transparent cursor-pointer"
            title="Background color"
          />
          {/* Link */}
          <button type="button" onClick={() => {
            const url = window.prompt("URL:", editor.getAttributes('link').href || "");
            if (url !== null) {
              if (url === "") {
                editor.chain().focus().unsetLink().run();
              } else {
                editor.chain().focus().setLink({ href: url }).run();
              }
            }
          }} className={editor.isActive('link') ? 'bg-blue-200 text-blue-700 font-bold px-2 py-1 rounded' : 'px-2 py-1 rounded'}>🔗</button>
          {/* Image */}
          <button type="button" onClick={() => fileInputRef.current?.click()} className="px-2 py-1 rounded">🖼️</button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={e => {
              if (e.target.files && e.target.files[0]) insertImage(e.target.files[0]);
            }}
          />
          {/* Table */}
          <button type="button" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className="px-2 py-1 rounded">Table</button>
          <button type="button" onClick={() => editor.chain().focus().addColumnBefore().run()} className="px-2 py-1 rounded">+Col</button>
          <button type="button" onClick={() => editor.chain().focus().addRowBefore().run()} className="px-2 py-1 rounded">+Row</button>
          <button type="button" onClick={() => editor.chain().focus().deleteColumn().run()} className="px-2 py-1 rounded">-Col</button>
          <button type="button" onClick={() => editor.chain().focus().deleteRow().run()} className="px-2 py-1 rounded">-Row</button>
          <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} className="px-2 py-1 rounded">DelTbl</button>
          {/* Undo/Redo/Clear */}
          <button type="button" onClick={() => editor.chain().focus().undo().run()} className="px-2 py-1 rounded">↺</button>
          <button type="button" onClick={() => editor.chain().focus().redo().run()} className="px-2 py-1 rounded">↻</button>
          <button type="button" onClick={() => editor.chain().focus().unsetAllMarks().run()} className="px-2 py-1 rounded">Clear</button>
        </div>
        <EditorContent editor={editor} className="min-h-[60vh]" />
      </div>
    </div>
  );
}
