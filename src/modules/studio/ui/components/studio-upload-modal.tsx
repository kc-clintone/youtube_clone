"use client";

import { Button } from "@/components/ui/button";
import { UploadDialog } from "@/components/upload-dialog";
import { trpc } from "@/trpc/client";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { VideoUploader } from "./video-uploader";
import { useRouter } from "next/navigation";

export const StudioUploadModal = () => {
  const router = useRouter();
  const utils = trpc.useUtils();
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success("Ready to create video");
      utils.studio.getMany.invalidate();
    },
    onError: () => {
      toast.error("Something went wrong!");
    },
  });

  // on video upload success
  const onVideoUploadSuccess = () => {
    if (!create.data?.video.id) return;

    create.reset();
    router.push(`/studio/videos/${create.data.video.id}`);
  };

  return (
    <>
      <UploadDialog
        title="Upload a video"
        open={!!create.data?.url}
        onOpenChange={() => create.reset()}
      >
        {create.data?.url ? (
          <VideoUploader
            endpoint={create.data.url}
            onSuccess={onVideoUploadSuccess}
          />
        ) : (
          <Loader2Icon />
        )}
      </UploadDialog>
      <Button
        variant="secondary"
        onClick={() => create.mutate()}
        disabled={create.isPending}
      >
        {create.isPending ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <PlusIcon />
        )}
        Create
      </Button>
    </>
  );
};
