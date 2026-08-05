"use client";

import { useEffect, useState, Component, type ReactNode } from "react";
import type { SocialEmbedBlockData } from "@/types/blog";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

// ---------------------------------------------------------------------------
// Error boundary — catches React-level render crashes. The more common failure
// mode (network/script load failure) is handled by the blockquote <a> fallback
// content that remains visible when embed.js fails to process.
// ---------------------------------------------------------------------------

interface ErrorBoundaryState {
  hasError: boolean;
}

class EmbedErrorBoundary extends Component<
  { url: string; children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="social-embed-fallback">
          <a href={this.props.url} target="_blank" rel="noopener noreferrer">
            View post on {this.props.url.includes("instagram") ? "Instagram" : "TikTok"} →
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Instagram embed — loads embed.js once, calls process() on each mount
// ---------------------------------------------------------------------------

function InstagramEmbed({ url }: { url: string }) {
  useEffect(() => {
    const script = document.querySelector('script[src*="instagram.com/embed.js"]');
    if (!script) {
      const s = document.createElement("script");
      s.src = "https://www.instagram.com/embed.js";
      s.async = true;
      document.body.appendChild(s);
      s.onload = () => window.instgrm?.Embeds.process();
    } else {
      window.instgrm?.Embeds.process();
    }
  }, [url]);

  return (
    <div>
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{ maxWidth: "540px", width: "100%", margin: "0 auto" }}
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          Loading Instagram post…
        </a>
      </blockquote>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TikTok embed — loads embed.js with cache-bust per page load. Only one script
// instance is live at a time; if multiple TikTok embeds exist on the same page,
// only the last mount triggers the script load — earlier blockquotes are still
// processed because embed.js scans all .tiktok-embed elements on execution.
// ---------------------------------------------------------------------------

let tiktokScriptPromise: Promise<void> | null = null;

function loadTikTokScript(): Promise<void> {
  const existing = document.querySelector('script[src*="tiktok.com/embed.js"]');
  if (existing) existing.remove();

  tiktokScriptPromise = new Promise<void>((resolve) => {
    const s = document.createElement("script");
    s.src = `https://www.tiktok.com/embed.js?t=${Date.now()}`;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => resolve();
    document.body.appendChild(s);
  });

  return tiktokScriptPromise;
}

function TikTokEmbed({ url }: { url: string }) {
  const videoId = url.match(/video\/(\d+)/)?.[1] ?? "";
  const username = url.match(/@([^/]+)/)?.[1] ?? "";

  useEffect(() => {
    // Debounce: wait a tick so all TikTok embeds on the page mount before
    // loading the script (embed.js processes all blockquotes it finds).
    const timer = setTimeout(() => {
      loadTikTokScript();
    }, 100);

    return () => clearTimeout(timer);
  }, [url]);

  return (
    <div>
      <blockquote
        className="tiktok-embed"
        cite={url}
        data-video-id={videoId}
        style={{ maxWidth: "605px", width: "100%", margin: "0 auto" }}
      >
        <section>
          <a href={`https://www.tiktok.com/@${username}`} target="_blank" rel="noopener noreferrer">
            Loading TikTok video…
          </a>
        </section>
      </blockquote>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface SocialEmbedBlockProps {
  data: SocialEmbedBlockData;
}

export function SocialEmbedBlock({ data }: SocialEmbedBlockProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="social-embed-container">
        <a href={data.url} target="_blank" rel="noopener noreferrer">
          Loading embed…
        </a>
      </div>
    );
  }

  return (
    <EmbedErrorBoundary url={data.url}>
      <div className="social-embed-container">
        {data.platform === "instagram" ? (
          <InstagramEmbed url={data.url} />
        ) : (
          <TikTokEmbed url={data.url} />
        )}
      </div>
    </EmbedErrorBoundary>
  );
}
