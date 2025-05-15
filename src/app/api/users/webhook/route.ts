import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req:Request) {
    const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    if (!SIGNING_SECRET) {
        throw new Error('Error: Please add a CLERK_WEBHOOK_SIGNING_SECRET from clerk dashboard to your .env.local or .env file')
    }

    //new svix instancw with id
    const wh = new Webhook(SIGNING_SECRET)

    //getting headers
    const headerPayload = await headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    //throw error if no headers
    if (!svix_id || !svix_timestamp || !svix_signature ) {
        return new Response('Error: Missing svix headers', {
            status: 400,
        })
    }

    //get body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    let evt: WebhookEvent

    //verify payload with headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error: could not verify webhook:', err)
        return new Response('Error: verification error', {
            status: 400,
        })
    }

    //do something with payload
    const eventType = evt.type
    
    //create a user
    if (eventType === "user.created") {
        const {data} = evt
        await db.insert(users).values({
            clerkId: data.id,
            name: `${data.first_name} ${data.last_name}`,
            imageUrl: data.image_url,
        })
    }

    //delete a user
    if (eventType === "user.deleted") {
        const { data } = evt;

        if (!data.id) {
            return new Response('Error: Missing user ID', {
                status: 400
            })
        }
        await db.delete(users).where(eq(users.clerkId, data.id))
    }

    //update a user
    if (eventType === "user.updated") {
        const { data } = evt

        await db.update(users).set({
            name: `${data.first_name} ${data.last_name}`,
            imageUrl: data.image_url,
        }).where(eq(users.clerkId, data.id))
    }

    return new Response('Webhook received', {
        status: 200
    })
}
 