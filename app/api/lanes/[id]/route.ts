import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import { NextRequest } from "next/server";

type LaneRouteContext = RouteContext<"/api/lanes/[id]">;

async function deleteLane(request: NextRequest, context: LaneRouteContext) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isLoggedIn) return new Response("Unauthorized", { status: 401 });

  const { id } = await context.params;

  await prisma.lanes.delete({ where: { id } });

  return Response.redirect(new URL("/lanes", request.url));
}

export async function PUT(request: NextRequest, context: LaneRouteContext) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isLoggedIn) return new Response("Unauthorized", { status: 401 });

  const data = await request.json();
  const { id } = await context.params;

  const lane = await prisma.lanes.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description ?? null,
    },
  });
  return Response.json(lane);
}

export async function DELETE(request: NextRequest, context: LaneRouteContext) {
  return deleteLane(request, context);
}

export async function POST(request: NextRequest, context: LaneRouteContext) {
  return deleteLane(request, context);
}
