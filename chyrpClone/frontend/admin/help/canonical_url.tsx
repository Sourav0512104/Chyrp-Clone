import React from "react";

export default function CanonicalUrlHelp() {
  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Canonical URL</h1>

      <p className="mb-4">
        If you enter a canonical URL, your site URLs will point someplace other
        than your install directory. You can use this feature to have Chyrp Lite
        (modern clone) installed in its own dedicated directory on your web
        server and still have your site accessible at your choice of destination
        directory.
      </p>

      <p className="mb-2">There are two requirements for this to work:</p>

      <ol className="list-decimal list-inside space-y-3">
        <li>
          Create an <code>index.py</code> (for Flask) in your destination
          directory with the following:
          <pre className="bg-gray-100 text-sm p-2 mt-2 rounded">
{`from backend.app import app

if __name__ == "__main__":
    app.run()`}
          </pre>
        </li>
        <li>
          Modify your URL rewrite directives (e.g., in <code>.htaccess</code> or
          Nginx config) to reflect the new destination directory.
        </li>
      </ol>
    </div>
  );
}
