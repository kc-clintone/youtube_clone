import { VideoGetOneOutput } from "@/modules/types";
import { AlertTriangleIcon } from "lucide-react";

interface VideoBannerProps {
  status: VideoGetOneOutput["muxStatus"];
}

export const VideoBanner = ({ status }: VideoBannerProps) => {
  if (status === "ready") return null;

  return (
    <div className="bg-yellow-500 py-3 px-4 rounded-b-xl items-center gap-2 flex">
      <AlertTriangleIcon className="size-4 text-black shrink-0" />
      <p className="text-xs md:text-sm font-medium line-clamp-1 text-black">
        video still processing
      </p>
    </div>
  );
};
