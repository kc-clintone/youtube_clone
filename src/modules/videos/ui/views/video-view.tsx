interface HomeVideoViewProps {
  videoId: string;
}

export const HomeVideoView = ({ videoId }: HomeVideoViewProps) => {
  return (
    <div className="mx-auto flex flex-col pt-2 5 mb-10 px-4 mx-w-[1700px]">
      <div className="flex flex-col gap-6 xl:flex-row">
        <div className="flex-1 min-w-0">
          <VideoSection />
        </div>
      </div>
    </div>
  );
};
