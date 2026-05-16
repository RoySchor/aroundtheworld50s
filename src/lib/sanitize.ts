import sanitize from "sanitize-html";

const SANITIZE_OPTIONS: sanitize.IOptions = {
  allowedTags: [
    "p",
    "a",
    "strong",
    "em",
    "b",
    "i",
    "br",
    "span",
    "div",
    "ul",
    "ol",
    "li",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "blockquote",
    "u",
    "img",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel", "class"],
    img: ["src", "alt", "class"],
    span: ["class"],
    div: ["class"],
    p: ["class"],
  },
  allowedSchemes: ["http", "https", "mailto"],
};

/** Sanitize HTML content from the database for safe rendering. */
export function sanitizeHtml(dirty: string): string {
  return sanitize(dirty, SANITIZE_OPTIONS);
}
