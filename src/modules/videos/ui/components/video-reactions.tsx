import { Button } from "@/components/ui/button";
import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Seperator } from "@/components/ui/seperator";

export const VideoReactions = () => {
  const VieweroReaction = "like" | "dislike";
  const likes = 10;
  const dislikes = 2;

  // TODO: properly implement his componennt
  return (
    <div className="flex items-center flex-none">
      <Button
        variant="secondary"
        className="rounded-l-none rounded-r-none gap-2 pr-4"
      >
        <ThumbsUpIcon
          className={cn("size-4", VieweroReaction === "like" && "fill-black")}
        />
        {likes}
      </Button>
      <Seperator className="h-7" orientation="vertical"/>
      <Button
        variant="secondary"
        className="rounded-l-none rounded-r-full pl-3"
      >
        <ThumbsDownIcon
          className={cn(
            "size-4",
            VieweroReaction === "dislike" && "fill-black"
          )}
        />
        <span className="ml-2">{dislikes}</span>
      </Button>
    </div>
  );
};
