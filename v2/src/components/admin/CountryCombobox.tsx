"use client";

import { useEffect, useRef, useState } from "react";
import { COUNTRIES } from "@/lib/country-codes";

interface CountryComboboxProps {
  value: string;
  onChange: (country: string) => void;
  onSelect: (country: string, code: string) => void;
  placeholder?: string;
}

const MAX_VISIBLE = 8;

export function CountryCombobox({
  value,
  onChange,
  onSelect,
  placeholder,
}: CountryComboboxProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const query = value.toLowerCase().trim();

  // Filter: prefer "starts with", fall back to "contains"
  let filtered: { label: string; code: string }[] = [];
  if (query) {
    const startsWith = COUNTRIES.filter((c) =>
      c.label.toLowerCase().startsWith(query),
    );
    filtered =
      startsWith.length > 0
        ? startsWith
        : COUNTRIES.filter((c) => c.label.toLowerCase().includes(query));
  }

  // Hide dropdown if the value already exactly matches a country
  const exactMatch = filtered.length === 1 && filtered[0].label.toLowerCase() === query;
  const showDropdown = open && query.length > 0 && filtered.length > 0 && !exactMatch;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
    }
  }

  function handleSelect(country: { label: string; code: string }) {
    onSelect(country.label, country.code);
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required
        className="w-full rounded border px-3 py-2 text-sm"
        autoComplete="off"
      />
      {showDropdown && (
        <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-auto rounded border bg-white shadow-lg">
          {filtered.slice(0, MAX_VISIBLE).map((c) => (
            <li
              key={c.label}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(c);
              }}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
            >
              {c.label}{" "}
              <span className="text-gray-400">({c.code})</span>
            </li>
          ))}
          {filtered.length > MAX_VISIBLE && (
            <li className="px-3 py-1.5 text-xs text-gray-400">
              {filtered.length - MAX_VISIBLE} more...
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
