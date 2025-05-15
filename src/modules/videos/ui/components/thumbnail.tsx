import { formatDuration } from "@/lib/utils";
import Image from "next/image";
import { THUMBNAIL_URL } from "@/modules/videos/constants";

interface ThumbnailProps {
  imageUrl?: string | null;
  previewUrl?: string | null;
  title: string;
  duration: number;
}

export const Thumbnail = ({
  imageUrl,
  previewUrl,
  title,
  duration,
}: ThumbnailProps) => {
  return (
    <div className="relative group">
      <div className="relative w-full aspect-video overflow-hidden rounded-md">
        <Image
          src={imageUrl || THUMBNAIL_URL}
          fill
          alt={title}
          className="size-full object-cover group-hover:opacity-0"
        />
        <Image
          unoptimized={!!previewUrl}
          src={previewUrl || THUMBNAIL_URL}
          fill
          alt={title}
          className="size-full object-cover opacity-0 group-hover:opacity-100"
        />
      </div>

      <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-sm font-medium">
        {formatDuration(duration)}
      </div>
    </div>
  );
};
