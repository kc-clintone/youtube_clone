import { db } from "@/db";
import { users, videos } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

export const ourFileRouter = {
  thumbnailUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        videoId: z.string().uuid(),
      })
    )
    .middleware(async ({ input }) => {
      const { userId: clerkUserId } = await auth();

      if (!clerkUserId) throw new UploadThingError("Unauthorized");

      const [dbUser] = await db
        .select()
        .from(users)
        .where(eq(users.clerkId, clerkUserId));

      if (!dbUser) throw new UploadThingError("Unauthorized");

      const [currentVideo] = await db
        .select({
          thumbnailKey: videos.thumbnailKey,
        })
        .from(videos)
        .where(and(eq(videos.id, input.videoId), eq(videos.userId, dbUser.id)));

      if (!currentVideo) throw new UploadThingError("Not found");

      if (currentVideo.thumbnailKey) {
        const utapi = new UTApi();

        await utapi.deleteFiles(currentVideo.thumbnailKey);
        await db
          .update(videos)
          .set({ thumbnailKey: null, thumbnailUrl: null })
          .where(
            and(eq(videos.id, input.videoId), eq(videos.userId, dbUser.id))
          );
      }

      return { dbUser, ...input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db
        .update(videos)
        .set({
          thumbnailUrl: file.url,
          thumbnailKey: file.key,
        })
        .where(
          and(
            eq(videos.id, metadata.videoId),
            eq(videos.userId, metadata.dbUser.id)
          )
        );
      return { uploadedBy: metadata.dbUser.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
