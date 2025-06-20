import { Button } from "@/components/ui/button";
import { ThumbsUpIcon, ThumbsDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { VideoGetOneOutput } from "@/modules/types";
import { useClerk } from "@clerk/clerk-react";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

interface VideoReactionsProps {
  viewerReaction: VideoGetOneOutput["viewerReaction"];
  videoId: string;
  likes: number;
  dislikes: number;
}

export const VideoReactions = ({
  viewerReaction,
  videoId,
  likes,
  dislikes,
}: VideoReactionsProps) => {
  // the logic to handle like and dislike reactions
  const clerkUser = useClerk();
  const utils = trpc.useUtils();

  const likeMutation = trpc.videoReactions.like.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
      // TODO: invalidate playlists in future
    },
    onError: (error) => {
      toast.error("Somehing wen wrong!");

      if (error.data?.code === "UNAUTHORIZED") {
        clerkUser.openSignIn();
      }
    },
  });

  const dislikeMutation = trpc.videoReactions.dislike.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
      // TODO: invalidate playlists in future
    },
    onError: (error) => {
      toast.error("Somehing wen wrong!");

      if (error.data?.code === "UNAUTHORIZED") {
        clerkUser.openSignIn();
      }
    },
  });

  return (
    <div className="flex items-center flex-none">
      <Button
        onClick={() => likeMutation.mutate({ videoId })}
        disabled={likeMutation.isPending || dislikeMutation.isPending}
        variant="secondary"
        className="rounded-l-none rounded-r-none gap-2 pr-4"
      >
        <ThumbsUpIcon
          className={cn("size-4", viewerReaction === "like" && "fill-black")}
        />
        {likes}
      </Button>
      <Separator className="h-7" orientation="vertical" />
      <Button
        onClick={() => dislikeMutation.mutate({ videoId })}
        disabled={likeMutation.isPending || dislikeMutation.isPending}
        variant="secondary"
        className="rounded-l-none rounded-r-full pl-3"
      >
        <ThumbsDownIcon
          className={cn("size-4", viewerReaction === "dislike" && "fill-black")}
        />
        {dislikes}
      </Button>
    </div>
  );
};
