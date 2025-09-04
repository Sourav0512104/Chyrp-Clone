"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { applyFormatting, Effect, isURL } from "@/lib/formatting";
import { uploadFile, previewContent } from "@/lib/api";
import UploadsModal from "./UploadsModal";
import PreviewModal from "./PreviewModal";
import MarkdownHelpModal from "./MarkdownHelpModal";

// ✅ Exposed methods for feathers and parent components
export type TextEditorHandle = {
  insertAtCaret: (text: string) => void;
  getValue: () => string;
  setEditorValue: (text: string) => void;
  focus: () => void;
};

type Props = {
  id: string;
  name: string;
  markdown?: boolean;
  persistKey?: string;
};

const TextEditor = forwardRef<TextEditorHandle, Props>(
  ({ id, name, markdown = false, persistKey }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [value, setValue] = useState("");
    const [showUploads, setShowUploads] = useState(false);
    const [previewHTML, setPreviewHTML] = useState<string | null>(null);
    const [showHelp, setShowHelp] = useState(false);

    // ✅ insertAtCaret helper
    const insertAtCaret = useCallback(
      (text: string) => {
        const el = textareaRef.current;
        if (!el) {
          setValue((v) => v + text);
          return;
        }
        const start = el.selectionStart ?? 0;
        const end = el.selectionEnd ?? 0;
        const next = value.slice(0, start) + text + value.slice(end);
        setValue(next);

        requestAnimationFrame(() => {
          el.setSelectionRange(start + text.length, start + text.length);
          el.focus();
        });
      },
      [value]
    );

    // ✅ Expose methods to parent via ref
    useImperativeHandle(
      ref,
      () => ({
        insertAtCaret,
        getValue: () => value,
        setEditorValue: (text: string) => setValue(text),
        focus: () => textareaRef.current?.focus(),
      }),
      [value]
    );

    // --- Word counter
    const wordCount = useMemo(() => {
      const trimmed = value.trim();
      if (!trimmed) return 0;
      const matches = trimmed.match(/\p{White_Space}+/gu);
      return matches ? matches.length + 1 : 1;
    }, [value]);

    // --- Session storage restore
    useEffect(() => {
      if (!persistKey) return;
      try {
        const cached = sessionStorage.getItem(persistKey);
        if (cached) setValue(cached);
      } catch {}
    }, [persistKey]);

    // --- Session storage persist
    useEffect(() => {
      if (!persistKey) return;
      try {
        sessionStorage.setItem(persistKey, value);
      } catch {}
    }, [value, persistKey]);

    // --- Formatting
    const doFormat = useCallback(
      (effect: Effect, fragment = "") => {
        const el = textareaRef.current!;
        const { selectionStart, selectionEnd } = el;
        const { next, caretStart, caretEnd } = applyFormatting(
          value,
          selectionStart,
          selectionEnd,
          effect,
          fragment,
          markdown
        );
        setValue(next);
        requestAnimationFrame(() => {
          el.setSelectionRange(caretStart, caretEnd);
          el.focus();
        });
      },
      [markdown, value]
    );

    // --- Direct file upload
    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const res = await uploadFile(file);
        const href = res.data?.href || "";
        if (href) {
          doFormat("insert", markdown ? `![](${href})` : `<img src="${href}">`);
        }
      } catch {
        alert("Upload failed.");
      } finally {
        e.target.value = "";
      }
    };

    // --- Drag & drop upload
    const onDrop = useCallback(
      async (e: React.DragEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        const file = e.dataTransfer?.files?.[0];
        if (!file) return;
        try {
          const res = await uploadFile(file);
          const href = res.data?.href || "";
          if (href) {
            doFormat(
              "insert",
              markdown ? `![](${href})` : `<img src="${href}">`
            );
          }
        } catch {
          alert("File upload failed.");
        }
      },
      [doFormat, markdown]
    );

    const onPreview = async () => {
  try {
    const html = await previewContent(value, markdown);
    setPreviewHTML(html);
  } catch (err) {
    console.error("Preview failed:", err);
    alert("Preview failed.");
  }
};


    return (
      <div className="space-y-2">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => setShowHelp(true)} title="Markdown Help">
            M
          </button>
          <button onClick={() => doFormat("h3")} type="button" title="Heading">H</button>
          <button onClick={() => doFormat("strong")} type="button" title="Bold"><b>B</b></button>
          <button onClick={() => doFormat("em")} type="button" title="Italic"><i>I</i></button>
          <button onClick={() => doFormat("del")} type="button" title="Strikethrough">S</button>
          <button onClick={() => doFormat("code")} type="button" title="Code">{`</>`}</button>
          <button
            type="button"
            onClick={() => {
              const el = textareaRef.current!;
              const sel = el.value.substring(el.selectionStart, el.selectionEnd);
              const frag = isURL(sel) ? "" : prompt("URL") || "";
              doFormat("hyperlink", frag);
            }}
            title="Hyperlink"
          >
            ↗
          </button>
          <button onClick={() => doFormat("hr")} type="button" title="Horizontal rule">—</button>
          <button onClick={() => doFormat("blockquote")} type="button" title="Quote">“”</button>
          <button
            type="button"
            onClick={() => {
              const frag = prompt("Image URL") || "";
              doFormat("img", frag);
            }}
            title="Image"
          >
            🖼
          </button>
          <button type="button" onClick={() => setShowUploads(true)} title="Insert from uploads">⛁</button>
          <label className="cursor-pointer" title="Upload">
            ⤴
            <input type="file" className="hidden" onChange={onFileChange} />
          </label>
          <button type="button" onClick={onPreview} title="Preview">👁</button>
        </div>

        {/* Textarea */}
        <textarea
          id={id}
          name={name}
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className="w-full h-64 border p-2 rounded"
        />

        {/* Word count */}
        <div className="text-sm text-gray-600">Words: {wordCount}</div>

        {/* Upload modal */}
        {showUploads && (
          <UploadsModal
            open={showUploads}
            onClose={() => setShowUploads(false)}
            onSelect={(file) =>
              doFormat("insert", markdown ? `![](${file.href})` : `<img src="${file.href}">`)
            }
          />
        )}

        {/* Preview modal */}
        {previewHTML && <PreviewModal html={previewHTML} onClose={() => setPreviewHTML(null)} />}

        {/* Markdown Help modal */}
        {showHelp && <MarkdownHelpModal onClose={() => setShowHelp(false)} />}
      </div>
    );
  }
);

TextEditor.displayName = "TextEditor";
export default TextEditor;
