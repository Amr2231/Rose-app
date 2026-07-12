"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";

type SafeImageProps = Omit<ImageProps, "src" | "onError"> & {
  src?: string | null;
  /** Extra classes for the placeholder shown when the image is missing/broken. */
  fallbackClassName?: string;
};

/**
 * Drop-in replacement for next/image that falls back to a placeholder
 * instead of a broken image / console error when `src` is empty or the
 * image fails to load (e.g. an expired temp-upload URL from the backend,
 * see upload-image.ts - temp files are only kept ~1h).
 *
 * Works in both `fill` mode and explicit width/height mode: pass the same
 * `className`/`fill` props you'd give next/image, the placeholder mirrors
 * the same sizing.
 */
export default function SafeImage({
  src,
  alt,
  fill,
  className,
  fallbackClassName,
  ...props
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex items-center justify-center bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600",
          fill ? "absolute inset-0" : className,
          fallbackClassName
        )}
      >
        <ImageOff className="h-8 w-8" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
