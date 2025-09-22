import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";

export async function POST(req: Request) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isLoggedIn) return new Response("Unauthorized", { status: 401 });

  const formData = await req.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;

  if (!title) return new Response("Missing title", { status: 400 });

  await prisma.lanes.create({
    data: { title, description },
  });

  return Response.redirect(new URL("/lanes", req.url));
}

export async function GET() {
  const lanes = await prisma.lanes.findMany({
    include: { memories: true },
    orderBy: { created_at: "desc" },
  });
  return Response.json(lanes);
}
