"use client";

import { useEffect, useState } from "react";

type Feather = {
  key: string;
  name: string;
  description?: string;
  enabled: boolean;
};

export default function ExtendFeathers() {
  const [feathers, setFeathers] = useState<Feather[]>([]);
  const [loading, setLoading] = useState(true);

  // Load feathers on mount
  useEffect(() => {
    loadFeathers();
  }, []);

  async function loadFeathers() {
    try {
      const res = await fetch("http://localhost:5000/api/feathers");
      const data = await res.json();
      setFeathers(data.feathers || []);
    } catch (err) {
      console.error("Failed to load feathers", err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleFeather(feather: Feather) {
    try {
      const endpoint = feather.enabled ? "disable" : "enable";
      const res = await fetch(`http://localhost:5000/api/feathers/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: feather.key }),
      });
      const data = await res.json();

      // ✅ Instead of wiping everything, update the local state properly
      if (data.feathers) {
        setFeathers(data.feathers);
      } else {
        // fallback: just flip this one feather locally
        setFeathers((prev) =>
          prev.map((f) =>
            f.key === feather.key ? { ...f, enabled: !f.enabled } : f
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle feather", err);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Feathers</h1>

      {loading ? (
        <p>Loading…</p>
      ) : feathers.length === 0 ? (
        <p>No feathers found.</p>
      ) : (
        <div className="space-y-4">
          {feathers.map((f) => (
            <div
              key={f.key}
              className="flex items-center justify-between border p-4 rounded"
            >
              <div>
                <h2 className="text-lg font-medium">{f.name}</h2>
                {f.description && (
                  <p className="text-sm text-gray-600">{f.description}</p>
                )}
              </div>
              <button
                onClick={() => toggleFeather(f)}
                className={`px-4 py-2 rounded ${
                  f.enabled
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {f.enabled ? "Disable" : "Enable"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
