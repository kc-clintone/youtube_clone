import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontalIcon,
  ShareIcon,
  ListPlusIcon,
  Trash2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

interface VideoMenuProps {
  videoId: string;
  onRemove?: () => void;
  variant?: "ghost" | "secondary";
}
// TODO: Finish the implementation of the VideoMenu component
export const VideoMenu = ({ videoId, onRemove, variant }: VideoMenuProps) => {
  const handleShare = () => {
    url = `${
    process.env.VERCEL_URL || "http://localhost:3000"
  }/videos${videoId}`;
  navigator.clipboard.writeText(url)
  toast.success("Link copied to clipboard!");
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} className="rounded-full" size="icon">
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem className="cursor-pointer" onClick={handleShare}>
          <ShareIcon className="mr-2 size-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => {}}>
          <ListPlusIcon className="mr-2 size-4" />
          Add to Playlist
        </DropdownMenuItem>
        {onRemove && (
          <DropdownMenuItem className="cursor-pointer" onClick={() => {}}>
            <Trash2Icon className="mr-2 size-4" />
            Remove
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
