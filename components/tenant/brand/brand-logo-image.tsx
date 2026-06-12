"use client"

import { TagIcon } from "lucide-react"

import { ImageZoom } from "@/components/ui/image-zoom"
import { cn } from "@/lib/utils"

interface BrandLogoImageProps {
  url?: string | null
  alt: string
  variant?: "table" | "view"
  className?: string
}

export function BrandLogoImage({
  url,
  alt,
  variant = "table",
  className,
}: BrandLogoImageProps) {
  if (!url) {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-md bg-muted",
          variant === "table" ? "size-10" : "size-16",
          className,
        )}
      >
        <TagIcon className="size-4 text-muted-foreground" />
      </div>
    )
  }

  if (variant === "view") {
    return (
      <ImageZoom className={cn("inline-block max-w-xs", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={alt}
          className="max-h-40 rounded-lg border object-contain"
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
