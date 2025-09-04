"use client";

import { useState } from "react";
import ExtendFeathers from "@/components/extend/ExtendFeathers";
import ExtendModules from "@/components/extend/ExtendModules";
import AdminLayout from "@/components/admin/AdminLayout";

export default function ExtendPage() {
  const [activeTab, setActiveTab] = useState("feathers");

   return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Extend</h1>

      {/* Sub-tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab("modules")}
          className={`px-4 py-2 rounded-t-md ${
            activeTab === "modules"
              ? "bg-white border border-b-0 border-gray-300 font-semibold"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Modules
        </button>
        <button
          onClick={() => setActiveTab("feathers")}
          className={`px-4 py-2 rounded-t-md ${
            activeTab === "feathers"
              ? "bg-white border border-b-0 border-gray-300 font-semibold"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Feathers
        </button>
        <button
          onClick={() => setActiveTab("themes")}
          className={`px-4 py-2 rounded-t-md ${
            activeTab === "themes"
              ? "bg-white border border-b-0 border-gray-300 font-semibold"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Themes
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === "feathers" && <ExtendFeathers />}
        {activeTab === "modules" && <ExtendModules/>}
        {activeTab === "themes" && <p>Themes management coming soon…</p>}
      </div>
    </AdminLayout>
  );
}
