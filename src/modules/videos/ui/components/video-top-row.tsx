import { VideoGetOneOutput } from "@/modules/types";
import { VideoOwner } from "./video-owner";
import { Videoreactions } from "./video-reactions";
import { VideoMenu } from "./video-menu";
import { VideoDescription } from "./video-description";
import { useMemo } from "react";
import {format, formatDistanceToNow} from "date-fns";

interface VideoTopRowProps {
  video: VideoGetOneOutput;
}

export const VideoTopRow = ({ video }: VideoTopRowProps) => {
  // Format the views to a more readable format
  const compactViews = useMemo(() => {
    return Intl.NumberFormat("en-US", {
      notation: "standard",
    }).format(video.viewsCount)
  }, [video.viewsCount])
  const expandViews = useMemo(() => {
    return Intl.NumberFormat("en-US", {
      notation: "standard",
    }).format(video.viewsCount)
  }, [video.viewsCount])
  ;

  // Format the date to a more readable format
  const compactDate = useMemo(() => {
    return formatDistanceToNow(new Date(video.createdAt, {addSuffix: true}));
  }, [video.createdAt]);
  const expandDate = useMemo(() => {
    //TODO: if the date shows the wrong format, change the locale to "en-US"
    return format(video.createdAt, "d MMMM yyyy");
  }, [video.createdAt]);

  return (
    <div className="flex flex-col gap-4 mt-4">
      <h1 className="text-xl font-semibold">{video.title}</h1>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <VideoOwner user={video.user} videoId={video.id} />
        <div className="flex overflow-x-auto sm:min-w-[calc(50%-6px)] sm:justify-end sm:overflow-visible pb-2 mb-2 sm:pb-0 sm:mb-0 gap-2">
          <Videoreactions />
          <VideoMenu videoId={video.id} variant="secondary"/>
        </div>
      </div>
      <VideoDescription 
      expandViews={expandViews}
      compactViews={compactViews}
      compactDate={compactDate}
      expandDate={expandDate}
      description={video.description} />
    </div>
  );
};
