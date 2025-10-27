import { VideoSection } from "../sections/video-section";
// import { SuggestionsSection } from "../sections/suggestions-section";
// import { CommentsSection } from "../sections/comments-section";

interface HomeVideoViewProps {
  videoId: string;
}

export const HomeVideoView = ({ videoId }: HomeVideoViewProps) => {
  return (
    <div className="mx-auto flex flex-col pt-2 5 mb-10 px-4 mx-w-[1700px]">
      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="flex-1 min-w-0">
          <VideoSection videoId={videoId} />
          <div className="mt-4 block xl:hidden">
            <SuggestionsSection />
          </div>
          <CommentsSection videoId={videoId} />
        </div>
        <div>
          <SuggestionsSection className="hidden xl:block w-full xl:w-[360px] 2xl:w-[400px] shrink-1" />
        </div>
      </div>
    </div>
  );
};
