import { eq } from "drizzle-orm";
import { and } from "drizzle-orm";
import { videoViews } from "./../../../db/schema";
import { db } from "@/db";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const VideoViewsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { videoId } = input;
      const { id: userId } = ctx.user;

      const existingView = await db
        .select()
        .from(videoViews)
        .where(
          and(eq(videoViews.userId, userId), eq(videoViews.videoId, videoId))
        );

      if (existingView) return existingView;

      const [createdView] = await db
        .insert(videoViews)
        .values({
          userId,
          videoId,
        })
        .returning();

      return createdView;
    }),
});
