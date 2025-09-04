import React, { useState } from "react";
import HelpModal from "./HelpModal";

/** Use like:
 *   <HelpLink href="/help/markdown" />
 */
export default function HelpLink({ href }: { href: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
      >
        Help
      </a>
      {open && <HelpModal open={open} href={href} onClose={() => setOpen(false)} />}
    </>
  );
}
