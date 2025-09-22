import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";
import { LaneClient } from "./LaneClient";

interface LanePageProps {
  params: { id: string };
}

export default async function LanePage({ params }: LanePageProps) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  const isLoggedIn = session.isLoggedIn === true;

  const lane = await prisma.lanes.findUnique({
    where: { id: params.id },
    include: {
      memories: {
        include: {
          memory_images: true,
        },
      },
    },
  });

  if (!lane) return notFound();

  const laneForClient = {
    id: lane.id,
    title: lane.title,
    description: lane.description,
    memories: lane.memories
      .slice()
      .sort((a, b) =>
        new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime()
      )
      .map((memory) => ({
        id: memory.id,
        title: memory.title,
        description: memory.description,
        occurred_at: memory.occurred_at.toISOString(),
        memory_images: memory.memory_images.map((img) => ({
          id: img.id,
          image_url: img.image_url,
          alt: img.alt,
        })),
      })),
  };

  return <LaneClient lane={laneForClient} isLoggedIn={isLoggedIn} />;
}
