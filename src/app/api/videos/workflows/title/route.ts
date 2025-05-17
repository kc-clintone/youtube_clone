import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs"
import { and, eq } from "drizzle-orm";

interface InputType {
  userId: string;
  videoId: string;
}

export const { POST } = serve(
  async (context) => {
    const input = context.requestPayload as InputType;
    const { userId, videoId } = input;

    await context.run("update-video", async () => {
      await db
      .update(videos)
      .set({
        title: "New title",
      })
      .where(and(
        eq(videos.id, videoId),
        eq(videos.userId, userId)
      ));
    });
  }
)
