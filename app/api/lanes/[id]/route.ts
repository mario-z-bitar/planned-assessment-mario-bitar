import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getIronSession<SessionData>( await cookies(), sessionOptions);
  if (!session.isLoggedIn) return new Response("Unauthorized", { status: 401 });

  const data = await req.json();
  const lane = await prisma.lanes.update({
    where: { id: params.id },
    data: {
      title: data.title,
      description: data.description ?? null,
    },
  });
  return Response.json(lane);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isLoggedIn) return new Response("Unauthorized", { status: 401 });

  await prisma.lanes.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}
