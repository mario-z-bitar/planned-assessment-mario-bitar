import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { supabase } from "@/lib/supabase";

async function deleteImage(req: Request, { params }: { params: { id: string } }) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isLoggedIn) return new Response("Unauthorized", { status: 401 });

  // Find the image record
  const image = await prisma.memory_images.findUnique({
    where: { id: params.id },
  });
  if (!image) return new Response("Not found", { status: 404 });

  // look up the memory to get lane_id
  const memory = await prisma.memories.findUnique({
    where: { id: image.memory_id },
    select: { lane_id: true },
  });

  if (!memory) return new Response("Memory not found", { status: 404 });

  // Remove from Supabase Storage (extract path from URL)
  const url = new URL(image.image_url);
  const path = decodeURIComponent(url.pathname.split("/").slice(3).join("/"));

  const { error } = await supabase.storage.from("memory-images").remove([path]);
  if (error) {
    console.error("Supabase delete error:", error.message);
    // Continue anyway — don't block DB delete
  }

  // Delete from DB
  await prisma.memory_images.delete({ where: { id: params.id } });

  // Redirect back to lane
  return Response.redirect(new URL(`/lanes/${memory.lane_id}`, req.url));
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
  return deleteImage(req, context);
}

export async function POST(req: Request, context: { params: { id: string } }) {
  return deleteImage(req, context);
}
