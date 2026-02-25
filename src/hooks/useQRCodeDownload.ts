import { useRef } from "react";

export const useQRCodeDownload = (fileName: string) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const download = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) {
      return;
    }

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${fileName}.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { qrRef, download };
};
