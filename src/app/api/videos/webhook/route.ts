import { db } from "@/db";
import { mux } from "@/lib/mux";
import { eq } from "drizzle-orm";
import { videos } from "@/db/schema";
import { headers } from "next/headers";
import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetDeletedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
} from "@mux/mux-node/resources/webhooks.mjs";
import { UTApi } from "uploadthing/server";

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET!;

type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetDeletedWebhookEvent
  | VideoAssetTrackReadyWebhookEvent;

export const POST = async (req: Request) => {
  if (!SIGNING_SECRET) throw new Error("MUX_SIGNING_SECRET missing");

  const headersPayload = await headers();
  const muxSignature = headersPayload.get("mux-signature");

  if (!muxSignature)
    return new Response("Mux signature not found", { status: 401 });

  const payload = await req.json();
  const body = JSON.stringify(payload);

  mux.webhooks.verifySignature(
    body,
    {
      "mux-signature": muxSignature,
    },
    SIGNING_SECRET
  );

  switch (payload.type as WebhookEvent["type"]) {
    case "video.asset.created": {
      const data = payload.data as VideoAssetCreatedWebhookEvent["data"];

      if (!data.upload_id)
        return new Response("No upload ID found", { status: 401 });

      await db
        .update(videos)
        .set({
          muxAssetId: data.id,
          muxStatus: data.status,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }

    case "video.asset.ready": {
      const data = payload.data as VideoAssetReadyWebhookEvent["data"];
      const playbackId = data.playback_ids?.[0].id;

      if (!playbackId)
        return new Response("Missing playback ID", { status: 400 });

      if (!data.upload_id)
        return new Response("Missing upload ID", { status: 400 });

      const tempThumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
      const tempPreviewUrl = `https://image.mux.com/${playbackId}/animated.gif`;

      const utapi = new UTApi();

      const [uploadedThumb, uploadedPrev] = await utapi.uploadFilesFromUrl([
        tempPreviewUrl,
        tempThumbnailUrl,
      ]);

      if (!uploadedPrev.data || !uploadedThumb.data) {
        return new Response("Failed to upload thumbnail or preview", {
          status: 500,
        });
      }

      const duration = data.duration ? Math.round(data.duration * 1000) : 0;

      const { key: thumbnailKey, url: thumbnailUrl } = uploadedThumb.data;
      const { key: previewKey, url: previewUrl } = uploadedPrev.data;

      await db
        .update(videos)
        .set({
          muxStatus: data.status,
          muxPlaybackId: playbackId,
          muxAssetId: data.id,
          thumbnailUrl,
          thumbnailKey,
          previewUrl,
          previewKey,
          duration,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }

    case "video.asset.errored": {
      const data = payload.data as VideoAssetErroredWebhookEvent["data"];

      if (!data.upload_id)
        return new Response("Missing upload ID", { status: 400 });

      await db
        .update(videos)
        .set({
          muxStatus: data.status,
        })
        .where(eq(videos.muxUploadId, data.upload_id));
      break;
    }

    case "video.asset.deleted": {
      const data = payload.data as VideoAssetDeletedWebhookEvent["data"];

      if (!data.upload_id)
        return new Response("Missing upload ID", { status: 400 });

      await db.delete(videos).where(eq(videos.muxUploadId, data.upload_id));
      break;
    }

    case "video.asset.track.ready": {
      const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & {
        asset_id: string;
      };

      const assetId = data.asset_id;
      const trackId = data.id;
      const status = data.status;

      if (!assetId) return new Response("Missing asset ID", { status: 400 });

      await db
        .update(videos)
        .set({
          muxTrackId: trackId,
          muxTrackStatus: status,
        })
        .where(eq(videos.muxAssetId, assetId));
      break;
    }
  }

  return new Response("Webhook received", { status: 200 });
};
