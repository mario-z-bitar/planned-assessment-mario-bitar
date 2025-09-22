import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { NextRequest } from "next/server";

type MemoryRouteContext = RouteContext<"/api/memories/[id]">;

async function deleteMemory(request: NextRequest, context: MemoryRouteContext) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isLoggedIn) return new Response("Unauthorized", { status: 401 });

  const { id } = await context.params;

  const memory = await prisma.memories.findUnique({
    where: { id },
    select: { lane_id: true },
  });

  if (!memory) return new Response("Not found", { status: 404 });

  await prisma.memories.delete({ where: { id } });

  return Response.redirect(new URL(`/lanes/${memory.lane_id}`, request.url));
}

export async function DELETE(request: NextRequest, context: MemoryRouteContext) {
  return deleteMemory(request, context);
}

export async function POST(request: NextRequest, context: MemoryRouteContext) {
  return deleteMemory(request, context);
}
