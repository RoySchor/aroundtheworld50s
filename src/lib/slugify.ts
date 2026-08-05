// Characters that NFD decomposition doesn't handle (single-codepoint special chars)
const CHAR_MAP: Record<string, string> = {
  ø: "o",
  Ø: "O",
  ð: "d",
  Ð: "D",
  ł: "l",
  Ł: "L",
  đ: "d",
  Đ: "D",
  ß: "ss",
  æ: "ae",
  Æ: "AE",
  œ: "oe",
  Œ: "OE",
  þ: "th",
  Þ: "Th",
};

export function slugify(name: string): string {
  return name
    .replace(/[øØðÐłŁđĐßæÆœŒþÞ]/g, (ch) => CHAR_MAP[ch] ?? ch)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
