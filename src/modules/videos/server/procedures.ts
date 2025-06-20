import { workflow } from "@/lib/workflow";
import { db } from "@/db";
import { users, videos, videoUpdateSchema, videoViews, videoReactions } from "@/db/schema";
import { mux } from "@/lib/mux";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq, getTableColumns, inArray } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

export const videosRouter = createTRPCRouter({
  // get one video
  getOne: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      // check for logged in user
      const {clerkUserId} = ctx
      let userId

      const [user] = await db
        .select()
        .from(users)
        .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []))

      const viewerReactions = db.$with("viewer_reactions").as();

      const [existingVideo] = await db
        .select({
          ...getTableColumns(videos),
          user: {
            ...getTableColumns(users),
          },
          viewsCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),
          likesCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "like")
            )
          ),
          dislikesCount: db.$count(
            videoReactions,
            and(
              eq(videoReactions.videoId, videos.id),
              eq(videoReactions.type, "dislike")
            )
          ),
        })
        .from(videos)
        .where(eq(videos.id, input.id))
        .innerJoin(users, eq(videos.userId, users.id));

      if (!existingVideo) throw new TRPCError({ code: "NOT_FOUND" });

      return existingVideo;
    }),
  // generate thumbnail workflow
  generateThumbnail: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        prompt: z.string().min(10),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const { workflowRunId } = await workflow.trigger({
        url: `${process.env.QSTASH_WORKFLOW_URL}/api/workflows/videos/thumbnail`,
        body: {
          userId,
          videoId: input.id,
          prompt: input.prompt,
        },
      });

      return {
        workflowRunId,
      };
    }),
  // generate title workflow
  generateTitle: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const { workflowRunId } = await workflow.trigger({
        url: `${process.env.QSTASH_WORKFLOW_URL}/api/workflows/videos/title`,
        body: {
          userId,
          videoId: input.id,
        },
      });

      return {
        workflowRunId,
      };
    }),
  // generate Description workflow
  generateDescription: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const { workflowRunId } = await workflow.trigger({
        url: `${process.env.QSTASH_WORKFLOW_URL}/api/workflows/videos/Description`,
        body: {
          userId,
          videoId: input.id,
        },
      });

      return {
        workflowRunId,
      };
    }),
  // reset thumbnail to default/odl thumbnail
  restoreThumbnail: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      // get the existing video
      const [currentVideo] = await db
        .select()
        .from(videos)
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));

      // throw errors if the current video does not exist or lack muxplayerId
      if (!currentVideo)
        throw new TRPCError({ code: "NOT_FOUND", message: "video not found" });

      // clean up old files
      if (currentVideo.thumbnailKey) {
        const utapi = new UTApi();

        await utapi.deleteFiles(currentVideo.thumbnailKey);
        await db
          .update(videos)
          .set({ thumbnailKey: null, thumbnailUrl: null })
          .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));
      }

      if (!currentVideo.muxPlaybackId)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "invalid request",
        });

      const utapi = new UTApi();

      const tempThumbnailUrl = `https://image.mux.com/${currentVideo.muxPlaybackId}/thumbnail.jpg`;
      const uploadedThumb = await utapi.uploadFilesFromUrl(tempThumbnailUrl);

      if (!uploadedThumb.data) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "no thumbnail url",
        });
      }

      const { key: thumbnailKey, ufsUrl: thumbnailUrl } = uploadedThumb.data;

      // reset the thumbnail
      const [newVideo] = await db
        .update(videos)
        .set({ thumbnailUrl, thumbnailKey })
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();

      return newVideo;
    }),

  //delete video
  remove: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      const [deletedVideo] = await db
        .delete(videos)
        .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
        .returning();

      if (!deletedVideo)
        throw new TRPCError({ code: "NOT_FOUND", message: "video not found" });

      return deletedVideo;
    }),

  //update video
  update: protectedProcedure
    .input(videoUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id: userId } = ctx.user;

      // check if video id is valid
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid video id",
        });
      }

      const [updatedVideo] = await db
        .update(videos)
        .set({
          title: input.title,
          description: input.description,
          categoryId: input.categoryId,
          visibility: input.visibility,
          updatedAt: new Date(),
        })
        .where(
          and(eq(videos.id, input.id as string), eq(videos.userId, userId))
        )
        .returning();

      // if video not found
      if (!updatedVideo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Video not found",
        });
      }

      return updatedVideo;
    }),

  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user;

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policies: ["public"],
        inputs: [
          {
            generated_subtitles: [
              {
                language_code: "en",
                name: "English",
              },
            ],
          },
        ],
      },
      cors_origin: "*",
    });

    const [video] = await db
      .insert(videos)
      .values({
        userId,
        title: "Untitled",
        muxStatus: "waiting",
        muxUploadId: upload.id,
      })
      .returning();

    return {
      video: video,
      url: upload.url,
    };
  }),
});
