"use client"

import { ImageIcon, ShapesIcon } from "lucide-react"

import { ImageZoom } from "@/components/ui/image-zoom"
import { cn } from "@/lib/utils"

interface CategoryMediaImageProps {
  url?: string | null
  alt: string
  kind?: "icon" | "banner"
  variant?: "table" | "view"
  className?: string
}

export function CategoryMediaImage({
  url,
  alt,
  kind = "icon",
  variant = "table",
  className,
}: CategoryMediaImageProps) {
  const FallbackIcon = kind === "banner" ? ImageIcon : ShapesIcon

  if (!url) {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md bg-muted",
          variant === "table" ? "size-10" : kind === "banner" ? "h-24 w-full max-w-md" : "size-16",
          className,
        )}
      >
        <FallbackIcon className="size-4 text-muted-foreground" />
      </div>
    )
  }

  if (variant === "view") {
    return (
      <ImageZoom
        className={cn(
          kind === "banner" ? "inline-block max-w-md" : "inline-block max-w-xs",
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={alt}
          className={cn(
            "rounded-lg border object-contain",
            kind === "banner" ? "max-h-48 w-full" : "max-h-40",
          )}
        />
      </ImageZoom>
    )
  }

  return (
    <ImageZoom className={cn("size-10 shrink-0", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        className="size-10 rounded-md object-cover"
      />
    </ImageZoom>
  )
}
