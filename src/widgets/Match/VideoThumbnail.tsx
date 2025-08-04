"use client"

import {useMemo} from "react";

interface VideoThumbnailProps {
  file: File
  className?: string
}

export function VideoThumbnail({ file, className = '' }: VideoThumbnailProps) {
  const url = useMemo(() => URL.createObjectURL(file), [file])

  return (
    <video
      src={url}
      className={`object-cover rounded-lg bg-gray-100 ${className}`}
      muted
      playsInline
    />
  )
}