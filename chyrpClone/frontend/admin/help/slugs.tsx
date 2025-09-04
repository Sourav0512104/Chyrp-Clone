import React from "react";

export default function SlugsHelp() {
  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Slugs</h1>

      <p className="mb-4">
        The slug is the URL-friendly identifying name for this post or page. You
        can enter the slug yourself or have it auto-generated when the post or
        page is created. A slug may contain only the letters <code>a–z</code>,
        the numbers <code>0–9</code>, and the hyphen-minus (<code>-</code>).
      </p>
    </div>
  );
}
