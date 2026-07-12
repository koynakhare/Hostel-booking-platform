import { useEffect, useState } from "react";
import { HOSTEL_PLACEHOLDER_SRC } from "@/utils/constants";
import { resolveImageUrl } from "@/utils/formatters";

interface HostelImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export default function HostelImage({ src, alt, className = "" }: HostelImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const imageSrc =
    !src || failed ? HOSTEL_PLACEHOLDER_SRC : resolveImageUrl(src);

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
