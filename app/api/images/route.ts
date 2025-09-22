import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) return new Response("Unauthorized", { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const memoryId = formData.get("memoryId") as string;

  if (!file || !memoryId) return new Response("Missing fields", { status: 400 });

  // build unique path
  const ext = file.name.split(".").pop();
  const filePath = `${memoryId}/${randomUUID()}.${ext}`;

  // upload to supabase
  const { error } = await supabase.storage
    .from("memory-images")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error(error);
    return new Response("Upload failed", { status: 500 });
  }

  // get public url
  const { data } = supabase.storage
    .from("memory-images")
    .getPublicUrl(filePath);

  // save in db
  await prisma.memory_images.create({
    data: {
      memory_id: memoryId,
      image_url: data.publicUrl,
      alt: file.name,
    },
  });

  const memory = await prisma.memories.findUnique({
    where: { id: memoryId },
    select: { lane_id: true },
  });

  return Response.redirect(new URL(`/lanes/${memory?.lane_id}`, req.url));
}
