import { Button } from "@/components/ui/button";
import MuxUploader, {
  MuxUploaderDrop,
  MuxUploaderFileSelect,
  MuxUploaderProgress,
  MuxUploaderStatus,
} from "@mux/mux-uploader-react";
import { UploadIcon } from "lucide-react";

interface VideoUploaderProps {
  endpoint?: string | null;
  onSuccess: () => void;
}

export const VideoUploader = ({ endpoint, onSuccess }: VideoUploaderProps) => {
  const UPLOADER_ID = "video-uploader";

  return (
    <div>
      <MuxUploader
        onSuccess={onSuccess}
        endpoint={endpoint}
        id={UPLOADER_ID}
        className="hidden group/uploader"
      />
      <MuxUploaderDrop muxUploader={UPLOADER_ID} className="group/drop">
        <div slot="heading" className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center rounded-md gap-2 bg-muted w-36 h-36">
            <UploadIcon className="size-10 text-muted-foreground group/drop-[&[active]]:animate-bounce transition-all duration-300" />
          </div>
          <div className="flex flex-col gap-2 text-center">
            <p className="text-sm">Drop a video file here to upload</p>
            <p className="text-sm text-muted-foreground">
              Your videos will remain private until ou publish them
            </p>
          </div>
          <MuxUploaderFileSelect muxUploader={UPLOADER_ID}>
            <Button type="button" className="rounded-md">
              Browse Files
            </Button>
          </MuxUploaderFileSelect>
        </div>
        <MuxUploaderStatus muxUploader={UPLOADER_ID} className="text-sm" />
        <MuxUploaderProgress
          muxUploader={UPLOADER_ID}
          className="text-sm"
          type="percentage"
        />
        <MuxUploaderProgress
          muxUploader={UPLOADER_ID}
          className="text-sm"
          type="bar"
        />
      </MuxUploaderDrop>
    </div>
  );
};
