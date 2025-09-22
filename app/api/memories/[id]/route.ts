import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";

async function deleteMemory(req: Request, { params }: { params: { id: string } }) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isLoggedIn) return new Response("Unauthorized", { status: 401 });

  const memory = await prisma.memories.findUnique({
    where: { id: params.id },
    select: { lane_id: true },
  });

  if (!memory) return new Response("Not found", { status: 404 });

  await prisma.memories.delete({ where: { id: params.id } });

  return Response.redirect(new URL(`/lanes/${memory.lane_id}`, req.url));
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
  return deleteMemory(req, context);
}

export async function POST(req: Request, context: { params: { id: string } }) {
  return deleteMemory(req, context);
}
