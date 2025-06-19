import { createTRPCRouter } from "../init";
import { studioRouter } from "@/modules/studio/server/procedures";
import { videosRouter } from "@/modules/videos/server/procedures";
import { categoriesRouter } from "@/modules/categories/server/procedures";
import { VideoViewsRouter } from "@/modules/video-views/server/procedures";

// import { TRPCError } from '@trpc/server';
export const appRouter = createTRPCRouter({
  studio: studioRouter,
  videos: videosRouter,
  categories: categoriesRouter,
  videoViews: VideoViewsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
