// frontend/components/admin/AdminLayout.tsx
"use client";

import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="p-0 w-full">
      {/* Top navigation */}
      <nav className="flex gap-4 mb-6 text-lg font-medium border-b pb-2 px-6">
        <a href="/admin/write" className="text-gray-600 hover:text-blue-600">
          Write
        </a>
        <a href="/admin/manage" className="text-gray-600 hover:text-blue-600">
          Manage
        </a>
        <a href="/admin/settings" className="text-gray-600 hover:text-blue-600">
          Settings
        </a>
        <a href="/admin/extend" className="text-gray-600 hover:text-blue-600">
          Extend
        </a>
      </nav>

      {/* Page content */}
      <div className="px-6">{children}</div>
    </div>
  );
}
