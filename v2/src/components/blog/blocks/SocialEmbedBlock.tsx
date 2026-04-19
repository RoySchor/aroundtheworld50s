"use client";

import { useEffect, useRef, useState, Component, type ReactNode } from "react";
import type { SocialEmbedBlockData } from "@/types/blog";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

// ---------------------------------------------------------------------------
// Error boundary — fallback to a plain link if embed fails (M2)
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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.querySelector(
      'script[src*="instagram.com/embed.js"]',
    );
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
    <div ref={containerRef}>
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
// TikTok embed — loads embed.js with cache-bust on each mount
// ---------------------------------------------------------------------------

function TikTokEmbed({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const videoId = url.match(/video\/(\d+)/)?.[1] ?? "";
  const username = url.match(/@([^/]+)/)?.[1] ?? "";

  useEffect(() => {
    const existing = document.querySelector(
      'script[src*="tiktok.com/embed.js"]',
    );
    if (existing) existing.remove();

    const s = document.createElement("script");
    s.src = `https://www.tiktok.com/embed.js?t=${Date.now()}`;
    s.async = true;
    document.body.appendChild(s);

    return () => {
      s.remove();
    };
  }, [url]);

  return (
    <div ref={containerRef}>
      <blockquote
        className="tiktok-embed"
        cite={url}
        data-video-id={videoId}
        style={{ maxWidth: "605px", width: "100%", margin: "0 auto" }}
      >
        <section>
          <a
            href={`https://www.tiktok.com/@${username}`}
            target="_blank"
            rel="noopener noreferrer"
          >
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
