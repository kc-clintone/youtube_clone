import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { VideoGetOneOutput } from "@/modules/types";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

interface VideoOwnerProps {
  user: VideoGetOneOutput["user"];
  videoId: string;
}

export const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
  const { userId: clerkUserId } = useAuth();
  return (
    <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
      <Link href={`/users/${user.id}`}>
        <div className="flex min-w-0 items-center-gap-3">
          <UserAvatar size="lg" imageUrl={user.imageUrl} name={user.name} />
          <span className="text-sm text-muted-foreground line-clamp-1">
            {0} Subscribers
          </span>
        </div>
      </Link>
      {clerkUserId === user.clerkId ? (
        <Button>
          <Link href={`/studio/videos/${videoId}`}>Edit video</Link>
        </Button>
      ) : (
        <Button>Subscribe</Button>
      )}
    </div>
  );
};
