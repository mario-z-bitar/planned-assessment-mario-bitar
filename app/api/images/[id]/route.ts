import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";

async function deleteImage(request: NextRequest, params: { id: string }) {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  if (!session.isLoggedIn) return new Response("Unauthorized", { status: 401 });

  const image = await prisma.memory_images.findUnique({
    where: { id: params.id },
  });
  if (!image) return new Response("Not found", { status: 404 });

  const memory = await prisma.memories.findUnique({
    where: { id: image.memory_id },
    select: { lane_id: true },
  });

  if (!memory) return new Response("Memory not found", { status: 404 });

  const url = new URL(image.image_url);
  const pathPart = decodeURIComponent(url.pathname.split("/").slice(3).join("/"));

  const { error } = await supabase.storage.from("memory-images").remove([pathPart]);
  if (error) {
    console.error("Supabase delete error:", error.message);
  }

  await prisma.memory_images.delete({ where: { id: params.id } });

  return Response.redirect(new URL(`/lanes/${memory.lane_id}`, request.url));
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  return deleteImage(request, params);
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return deleteImage(request, params);
}
