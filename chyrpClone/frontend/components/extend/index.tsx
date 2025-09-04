"use client";

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import ExtendFeathers from "@/components/extend/ExtendFeathers";

export default function ExtendPage() {
  const [active, setActive] = useState("feathers");

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-4">Extend</h1>

      {/* Sub-tabs under Extend */}
      <div className="flex gap-2 mb-4 border-b">
        <button
          onClick={() => setActive("modules")}
          className={`px-4 py-2 rounded-t-md ${
            active === "modules"
              ? "bg-white border border-b-0 border-gray-300 font-semibold"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Modules
        </button>
        <button
          onClick={() => setActive("feathers")}
          className={`px-4 py-2 rounded-t-md ${
            active === "feathers"
              ? "bg-white border border-b-0 border-gray-300 font-semibold"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Feathers
        </button>
        <button
          onClick={() => setActive("themes")}
          className={`px-4 py-2 rounded-t-md ${
            active === "themes"
              ? "bg-white border border-b-0 border-gray-300 font-semibold"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Themes
        </button>
      </div>

      {/* Active sub-tab content */}
      {active === "modules" && <p>Modules management coming soon…</p>}
      {active === "feathers" && <ExtendFeathers />}
      {active === "themes" && <p>Themes management coming soon…</p>}
    </AdminLayout>
  );
}
