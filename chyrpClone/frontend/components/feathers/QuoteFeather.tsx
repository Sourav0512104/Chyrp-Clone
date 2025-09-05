"use client";

import TextEditor, { TextEditorHandle } from "@/components/admin/TextEditor";

type Props = {
  editorRef: React.RefObject<TextEditorHandle | null>;   // Shared body/captions
  sourceRef: React.RefObject<TextEditorHandle | null>;   // Independent "Source"
  onQuoteChange?: (value: string) => void;               // 🔑 NEW
};

export default function QuoteFeather({ editorRef, sourceRef, onQuoteChange }: Props) {
  return (
    <div className="space-y-6 p-4 border rounded bg-gray-50">
      {/* Quote textarea (shared with body/desc/captions) */}
      <div>
        <label className="block font-medium mb-1">Quote</label>
        <TextEditor
          id="quote"
          name="quote"
          markdown={true}
          persistKey="quote_body"
          ref={editorRef}
          onChange={(val) => onQuoteChange?.(val)}   // 🔑 propagate changes
        />
      </div>

      {/* Independent Source */}
      <div>
        <label className="block font-medium mb-1">Source</label>
        <TextEditor
          id="source"
          name="source"
          markdown={true}
          persistKey="quote_source"
          ref={sourceRef}
        />
      </div>
    </div>
  );
}
