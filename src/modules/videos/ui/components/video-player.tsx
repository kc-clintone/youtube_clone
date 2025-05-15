"use client";

import MuxPlayer from "@mux/mux-player-react";
import { THUMBNAIL_URL } from "@/modules/videos/constants";

interface VideoPlayerProps {
  playbackId?: string | null | undefined;
  posterUrl?: string | undefined;
  autoPlay?: boolean;
  onPlay?: () => void;
}

export const VideoPlayer = ({
  playbackId,
  posterUrl,
  autoPlay,
  onPlay,
}: VideoPlayerProps) => {
//   if (!playbackId) return null;

  return (
    <MuxPlayer
      playbackId={playbackId || ""}
      poster={posterUrl || THUMBNAIL_URL}
      playerInitTime={0}
      autoPlay={autoPlay}
      thumbnailTime={0}
      accentColor="#FF2056"
      onPlay={onPlay}
      className="w-full h-full object-contain"
    />
  );
};
