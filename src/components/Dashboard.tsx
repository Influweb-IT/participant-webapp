import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// iframeResize is loaded as a global via the <script> tag in index.html
declare const iframeResize: (options: object, el: HTMLIFrameElement) => void;

// Streamlit draws the dashboard in pieces and each figure loads on its own, so the iframe
// is resized many times while loading. Keep it hidden in a fixed-height box until its size
// has been stable for SETTLE_MS (and, when same-origin, its images have loaded), then show it once.
const SETTLE_MS = 700;
// Show the dashboard anyway after this long (e.g. if the resizer never reports).
const MAX_WAIT_MS = 10000;
const PLACEHOLDER_HEIGHT = 300;

// True while images inside the iframe are still loading; false when we can't look inside
// (cross-origin), in which case the settle timer alone decides.
const imagesPending = (iframe: HTMLIFrameElement) => {
  try {
    return Array.from(iframe.contentDocument?.images ?? []).some((img) => !img.complete);
  } catch {
    return false;
  }
};

const Dashboard = (props: any) => {
  const { i18n } = useTranslation();
  const ref = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);
  const url = `${props.baseUrl}?lang=${i18n.language}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reveal = () => setReady(true);
    const maxWait = setTimeout(reveal, MAX_WAIT_MS);
    let settle: ReturnType<typeof setTimeout> | undefined;
    const waitForSettle = () => {
      clearTimeout(settle);
      settle = setTimeout(() => (imagesPending(el) ? waitForSettle() : reveal()), SETTLE_MS);
    };
    if (typeof iframeResize === "function") {
      iframeResize({
        license: "GPLv3",
        log: false,
        // The first resize ('init') is Streamlit's empty shell, before any content arrives.
        onResized: ({ type }: { type: string }) => type !== "init" && waitForSettle(),
      }, el);
    } else {
      // Resizer script missing (e.g. the CDN is blocked): the iframe keeps its default
      // height, but the rest of the page must still render, so show it right away.
      reveal();
    }
    return () => {
      clearTimeout(settle);
      clearTimeout(maxWait);
      (el as any).iFrameResizer?.close();
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        height: ready ? undefined : PLACEHOLDER_HEIGHT,
        overflow: ready ? undefined : "hidden",
      }}
    >
      {!ready && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: PLACEHOLDER_HEIGHT,
          }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <iframe
        ref={ref}
        id="iframe-target"
        src={url}
        title="Influweb Dashboard"
        style={{
          width: "1px",
          minWidth: "100%",
          border: "none",
          opacity: ready ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
};

export default Dashboard;
