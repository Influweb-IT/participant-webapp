import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

// iframeResize is loaded as a global via the <script> tag in index.html
declare const iframeResize: (options: object, el: HTMLIFrameElement) => void;

const Dashboard = (props: any) => {
  const { i18n } = useTranslation();
  const ref = useRef<HTMLIFrameElement>(null);
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
    <iframe
      ref={ref}
      id="iframe-target"
      src={url}
      title="Influweb Dashboard"
      style={{ width: "1px", minWidth: "100%", border: "none" }}
    />
  );
};

export default Dashboard;
