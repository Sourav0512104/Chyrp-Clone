// Utilities that mirror the old Write.formatting() behavior.

export type Effect =
  | "strong" | "em" | "code" | "h3" | "del" | "mark"
  | "hyperlink" | "hr" | "blockquote" | "img" | "insert";

export function applyFormatting(
  original: string,
  selectionStart: number,
  selectionEnd: number,
  effect: Effect,
  fragment = "",
  markdown = false
) {
  let after = "";
  let selection = original.substring(selectionStart, selectionEnd);

  // If user selected "word " (note trailing space from double-click)
  if (selection.length > 0 && selection.endsWith(" ")) {
    after = " ";
    selection = selection.slice(0, -1);
  }

  let opening = "";
  let closing = "";

  switch (effect) {
    case "strong":
      opening = markdown ? "**" : "<strong>";
      closing = markdown ? "**" : "</strong>";
      if (!selection) selection = " ";
      break;
    case "em":
      opening = markdown ? "*" : "<em>";
      closing = markdown ? "*" : "</em>";
      if (!selection) selection = " ";
      break;
    case "code":
      opening = markdown ? "`" : "<code>";
      closing = markdown ? "`" : "</code>";
      if (!selection) selection = " ";
      break;
    case "h3":
      opening = markdown ? "### " : "<h3>";
      closing = markdown ? "" : "</h3>";
      break;
    case "del":
      opening = markdown ? "~~" : "<del>";
      closing = markdown ? "~~" : "</del>";
      if (!selection) selection = " ";
      break;
    case "mark":
      opening = markdown ? "==" : "<mark>";
      closing = markdown ? "==" : "</mark>";
      if (!selection) selection = " ";
      break;
    case "hyperlink":
      if (isURL(selection)) {
        if (fragment) {
          selection = fragment;
          break;
        }
        opening = markdown ? "[](" : '<a href="';
        closing = markdown ? ")" : '"></a>';
      } else {
        opening = markdown ? "[" : `<a href="${fragment}">`;
        closing = markdown ? `](${fragment})` : "</a>";
      }
      break;
    case "hr":
      opening = "";
      closing = markdown ? "\n***\n" : "\n<hr>\n";
      break;
    case "blockquote":
      opening = markdown ? "\n>>>\n" : "\n<blockquote>\n";
      closing = markdown ? "\n>>>\n" : "\n</blockquote>\n";
      break;
    case "img":
      if (isURL(selection)) {
        if (fragment) {
          selection = fragment;
          break;
        }
        opening = markdown ? "![](" : '<img alt="" src="';
        closing = markdown ? ")" : '">';
      } else {
        opening = markdown ? "![" : '<img alt="';
        closing = markdown ? `](${fragment})` : `" src="${fragment}">`;
      }
      break;
    case "insert":
      opening = "";
      closing = "";
      selection = fragment;
      break;
  }

  const text = opening + selection + closing + after;
  const next =
    original.slice(0, selectionStart) + text + original.slice(selectionEnd);

  const caret =
    selectionStart + text.length; // place caret at end of inserted text

  return { next, caretStart: caret, caretEnd: caret };
}

export function isURL(text: string) {
  try {
    // Accept bare domains with scheme-less -> add scheme later if needed
    const u = new URL(text.startsWith("http") ? text : `http://${text}`);
    return !!u.hostname;
  } catch {
    return false;
  }
}
