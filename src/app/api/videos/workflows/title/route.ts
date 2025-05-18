import { db } from "@/db";
import { videos } from "@/db/schema";
import { serve } from "@upstash/workflow/nextjs"
import { and, eq } from "drizzle-orm";

interface InputType {
  userId: string;
  videoId: string;
}

const TITLE_SYSTEM_PROMPT = `Your task is to generate an SEO-focused title for a YouTube video based on its transcript. Please follow these guidelines:

- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspect of the video content.
- Avoid jargon or overly complex language unless it directly supports searchability.
- Use action-oriented phrasing or clear value propositions where applicable.
- Ensure the title is 3-8 words long and no more than 100 characters.
- ONLY return the title as plain text. Do not add quotes or any additional formatting.`;

export const { POST } = serve(
  async (context) => {
    const input = context.requestPayload as InputType;
    const { userId, videoId } = input;

    const { body } = await context.api.openai.call(
      "generate-title",
  {
    baseURL: "https://api.deepseek.com",
    token: process.env.DEEPSEEK_API_KEY!,
    operation: "chat.completions.create",
    body: {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: TITLE_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: "User shouts back 'hi!'"
        }
      ],
    },
  }
);
    const title = body.choices[0]?.message.content;

    await context.run("update-video", async () => {
      await db
      .update(videos)
      .set({
        title: title || null,
      })
      .where(and(
        eq(videos.id, videoId),
        eq(videos.userId, userId)
      ));
    });
  }
)
