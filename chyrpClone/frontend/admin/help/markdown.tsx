import React from "react";

export default function MarkdownHelp() {
  const examples = [
    { md: "### Heading", result: <h3>Heading</h3> },
    { md: "**Strong**", result: <strong>Strong</strong> },
    { md: "*Emphasis*", result: <em>Emphasis</em> },
    { md: "*_Citation_*", result: <cite>Citation</cite> },
    { md: "~~Strikethrough~~", result: <del>Strikethrough</del> },
    { md: "`Code`", result: <code>Code</code> },
    { md: "==Highlight==", result: <mark>Highlight</mark> },
    { md: "++Superscript++", result: <sup>Superscript</sup> },
    { md: "--Subscript--", result: <sub>Subscript</sub> },
    { md: "Blank line", result: <>New paragraph</> },
    { md: "[title](URL)", result: <a href="#">Hyperlink</a> },
    { md: "![description](URL)", result: <>Image</> },
    { md: "- List of items", result: <ul><li>List of items</li></ul> },
    { md: "1. List of items", result: <ol><li>List of items</li></ol> },
    { md: "> Blockquote", result: <blockquote>Blockquote</blockquote> },
    { md: "< Aside", result: <aside>Aside</aside> },
    { md: ": Figure\n:: Caption", result: <figure>Figure<figcaption>Caption</figcaption></figure> },
    { md: "````\nCode block\n````", result: <pre><code>Code block</code></pre> },
    { md: "A footnote label. [^label]\n\n[^label]: The footnote.", result: <>A footnote label. <sup><a href="#">1</a></sup></> },
  ];

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-4">Markdown</h1>

      <p className="mb-6">
        Markdown is a syntax for writing structured documents in plain text. Here are the basics to get you started:
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Markdown</th>
              <th className="border px-4 py-2 text-left">Result</th>
            </tr>
          </thead>
          <tbody>
            {examples.map((ex, idx) => (
              <tr key={idx} className="border-t">
                <td className="border px-4 py-2 font-mono whitespace-pre-line">{ex.md}</td>
                <td className="border px-4 py-2">{ex.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
