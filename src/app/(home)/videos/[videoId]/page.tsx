import { HomeVideoView } from "@/modules/videos/ui/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";

interface PageProps {
  params: Promise<{
    videoId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { videoId } = await params;

  void trpc.videos.getOne.prefetch({ id: videoId });

  return (
    <HydrateClient>
      <HomeVideoView videoId={videoId} />
    </HydrateClient>
  );
};

export default Page;
