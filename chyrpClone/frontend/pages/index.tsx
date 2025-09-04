// frontend/pages/index.tsx
"use client";

import { useEffect, useState } from "react";

type Post = {
  id: number;
  title: string;
  body: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("http://localhost:5000/api/posts");
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-center">
      {/* Site title */}
      <header className="py-8 border-b border-gray-200">
        <h1 className="text-3xl font-bold">My Awesome Site</h1>

        {/* Nav */}
        <nav className="flex justify-center gap-6 mt-4 text-gray-700">
          <a href="#" className="hover:underline">Audio test</a>
          <a href="#" className="hover:underline">Email</a>
          <a href="#" className="hover:underline">Feed</a>
          <a href="#" className="hover:underline">Archive</a>
          <a href="/admin" className="hover:underline">Log in</a>
          <a href="/admin/write" className="hover:underline font-semibold text-blue-600">
            Admin
          </a>
        </nav>

        {/* Search */}
        <div className="mt-6 flex justify-center">
          <input
            type="text"
            placeholder="Search…"
            className="border rounded-l px-3 py-2 w-64"
          />
          <button className="bg-brown-600 text-white px-4 rounded-r">
            Search
          </button>
        </div>
      </header>

      {/* Posts */}
      <main className="py-12">
        {loading ? (
          <p>Loading…</p>
        ) : posts.length === 0 ? (
          <p className="text-lg font-semibold text-gray-600">
            Nothing here yet!
          </p>
        ) : (
          <div className="space-y-8 max-w-2xl mx-auto">
            {posts.map((post) => (
              <article
                key={post.id}
                className="border-b border-gray-200 pb-4 text-left"
              >
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <div className="mt-2 text-gray-700">{post.body}</div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
