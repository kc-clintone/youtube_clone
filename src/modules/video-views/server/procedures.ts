import { db } from '@/db';
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const VideoViewsRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({
            videoId: z.string().uuid(),
        }))
        .mutation(async ({ ctx, input}) => {
            const { videoId } = input;
            const {id: userId} = ctx.user;

            const existingView = await db
                .select()
                .from(videoViews)
        })
})