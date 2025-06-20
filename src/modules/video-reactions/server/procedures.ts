import { eq } from "drizzle-orm";
import { and } from "drizzle-orm";
import { videoReactions } from "@/db/schema";
import { db } from "@/db";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const VideoReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { videoId } = input;
      const { id: userId } = ctx.user;

      const existingReaction = await db
        .select()
        .from(videoReactions)
        .where(
          and(eq(videoReactions.userId, userId), eq(videoReactions.videoId, videoId), eq(videoReactions.type, "like"))
        );

      if (existingReaction) {
        const [deleteReaction] = await db
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.userId, userId),
              eq(videoReactions.videoId, videoId)
            )
          )
          .returning();
          return deleteReaction;
      };

      const [createdReaction] = await db
        .insert(videoReactions)
        .values({
          userId,
          videoId,
          type: "like",
        })
        .onConflictDoUpdate({
          target: [videoReactions.userId, videoReactions.videoId],
          set: {
            type: "like",
          },
        })
        .returning();

      return createdReaction;
    }),
});
