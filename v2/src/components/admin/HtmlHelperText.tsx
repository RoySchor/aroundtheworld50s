"use client";

import { useState } from "react";

export function HtmlHelperText() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs text-blue-600 hover:underline"
      >
        {isOpen ? "Hide formatting help" : "Formatting help"}
      </button>
      {isOpen && (
        <div className="mt-2 rounded border bg-gray-50 p-3 text-xs text-gray-600 space-y-1">
          <p><code className="bg-gray-200 px-1 rounded">&lt;b&gt;bold&lt;/b&gt;</code> — <b>bold</b></p>
          <p><code className="bg-gray-200 px-1 rounded">&lt;i&gt;italic&lt;/i&gt;</code> — <i>italic</i></p>
          <p><code className="bg-gray-200 px-1 rounded">&lt;a href=&quot;url&quot;&gt;link text&lt;/a&gt;</code> — clickable link</p>
          <p><code className="bg-gray-200 px-1 rounded">&lt;br&gt;</code> — line break</p>
          <p><code className="bg-gray-200 px-1 rounded">&lt;ul&gt;&lt;li&gt;item&lt;/li&gt;&lt;/ul&gt;</code> — bullet list</p>
          <p><code className="bg-gray-200 px-1 rounded">&lt;h3&gt;heading&lt;/h3&gt;</code> — section heading</p>
        </div>
      )}
    </div>
  );
}
