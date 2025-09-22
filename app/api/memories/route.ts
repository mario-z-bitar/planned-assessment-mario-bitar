import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";

export async function POST(req: Request) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isLoggedIn) return new Response("Unauthorized", { status: 401 });

  const formData = await req.formData();
  const laneId = formData.get("laneId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const occurredAt = formData.get("occurredAt") as string;

  if (!laneId || !title || !occurredAt) {
    return new Response("Missing fields", { status: 400 });
  }

  await prisma.memories.create({
    data: {
      lane_id: laneId,
      title,
      description,
      occurred_at: new Date(occurredAt),
    },
  });

  return Response.redirect(new URL(`/lanes/${laneId}`, req.url));
}