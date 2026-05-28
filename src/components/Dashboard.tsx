import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// iframeResize is loaded as a global via the <script> tag in index.html
declare const iframeResize: (options: object, el: HTMLIFrameElement) => void;

const Dashboard = (props: any) => {
  const { i18n } = useTranslation();
  const ref = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);
  const url = `${props.baseUrl}/${i18n.language}`;

  useEffect(() => {
    if (!ref.current) return;
    iframeResize({ license: "GPLv3", log: false }, ref.current);
    const el = ref.current;
    return () => {
      (el as any).iFrameResizer?.close();
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 300,
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
        onLoad={() => setLoaded(true)}
        style={{
          width: "1px",
          minWidth: "100%",
          border: "none",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
};

export default Dashboard;
