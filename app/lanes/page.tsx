import { prisma } from "@/lib/prisma";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import { LanesClient } from "./LanesClient";

export default async function LanesPage() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  const isLoggedIn = session.isLoggedIn === true;

  const lanes = await prisma.lanes.findMany({
    include: {
      memories: true,
    },
    orderBy: { created_at: "desc" },
  });

  const lanesForClient = lanes.map((lane) => ({
    id: lane.id,
    title: lane.title,
    description: lane.description,
    memories: lane.memories
      .slice()
      .sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime())
      .map((memory) => ({
        id: memory.id,
        title: memory.title,
        description: memory.description,
        occurred_at: memory.occurred_at.toISOString(),
      })),
  }));

  return <LanesClient lanes={lanesForClient} isLoggedIn={isLoggedIn} />;
}
