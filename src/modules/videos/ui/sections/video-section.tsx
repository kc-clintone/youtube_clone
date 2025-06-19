"use client";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { VideoPlayer } from "../components/video-player";
import { VideoBanner } from "../components/video-banner";
import { useAuth } from "@clerk/nextjs";

interface VideoSectionProps {
  videoId: string;
}

export const VideoSection = ({ videoId }: VideoSectionProps) => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <VideoSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const VideoSectionSuspense = ({ videoId }: VideoSectionProps) => {
  const { isSignedIn } = useAuth();
  const utils = trpc.useUtils();
  const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });
  const creatView = trpc.videoViews.create.useMutation({
    onsuccess: () => {
      utils.videos.getOne.invalidate({
        id: videoId,
      });
    },
  });
  const handlePlay = () => {
    if (isSignedIn) return;

    creatView.mutate({ videoId });
  };

  return (
    <>
      <div
        className={cn(
          "bg-black aspect-video overflow-hidden relative rounded-xl",
          video.muxStatus !== "ready" && "rounded-b-none"
        )}
      >
        <VideoPlayer
          autoPlay
          onPlay={handlePlay}
          playbackId={video.muxPlaybackId}
          posterUrl={video.thumbnailUrl || ""}
        />
      </div>
      <VideoBanner status={video.muxStatus} />
    </>
  );
};
