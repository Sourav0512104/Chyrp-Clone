"use client";

import { useEffect, useState } from "react";

type Module = {
  key: string;
  name: string;
  description?: string;
  enabled: boolean;
};

export default function ExtendModules() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    loadModules();
  }, []);

  async function loadModules() {
    try {
      const res = await fetch("http://localhost:5000/api/modules");
      const data = await res.json();
      setModules(data.modules || []);
    } catch (e) {
      console.error("Failed to load modules", e);
    } finally {
      setLoading(false);
    }
  }

  async function toggleModule(mod: Module) {
    try {
      setBusy(mod.key);
      const endpoint = mod.enabled ? "disable" : "enable";
      const res = await fetch(`http://localhost:5000/api/modules/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: mod.key }),
      });
      const data = await res.json();
      setModules(data.modules || []);
    } catch (e) {
      console.error("Failed to toggle module", e);
    } finally {
      setBusy(null);
    }
  }

  async function clearCacher() {
    try {
      setBusy("cacher_clear");
      const res = await fetch("http://localhost:5000/api/cacher/clear", {
        method: "POST",
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || "Failed to clear cache");
      } else {
        alert(`Cleared ${data.removed} cached objects.`);
      }
    } catch (e) {
      console.error("Failed to clear cache", e);
    } finally {
      setBusy(null);
    }
  }

  if (loading) return <p>Loading…</p>;
  if (modules.length === 0) return <p>No modules found.</p>;

  return (
    <div className="space-y-4">
      {modules.map((m) => (
        <div key={m.key} className="flex items-center justify-between border p-4 rounded">
          <div className="pr-4">
            <h3 className="text-lg font-medium">{m.name}</h3>
            {m.description && <p className="text-sm text-gray-600">{m.description}</p>}
            {m.key === "cacher" && m.enabled && (
              <div className="mt-2">
                <button
                  disabled={busy === "cacher_clear"}
                  onClick={clearCacher}
                  className="px-3 py-1 rounded border hover:bg-gray-100"
                >
                  {busy === "cacher_clear" ? "Clearing…" : "Clear cache"}
                </button>
              </div>
            )}
          </div>
          <button
            disabled={busy === m.key}
            onClick={() => toggleModule(m)}
            className={`px-4 py-2 rounded ${
              m.enabled
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {busy === m.key ? "Working…" : m.enabled ? "Disable" : "Enable"}
          </button>
        </div>
      ))}
    </div>
  );
}
