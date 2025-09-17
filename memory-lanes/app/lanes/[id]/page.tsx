import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";

interface LanePageProps {
  params: { id: string };
}

export default async function LanePage({ params }: LanePageProps) {
  // check session
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  const isLoggedIn = session.isLoggedIn === true;

  // fetch lane
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

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-2">{lane.title}</h1>
      {lane.description && (
        <p className="text-gray-400 mb-6">{lane.description}</p>
      )}

      {isLoggedIn && (
        <form action="/api/memories" method="post" className="mb-8 space-y-2">
          <input type="hidden" name="laneId" value={lane.id} />
          <input
            type="text"
            name="title"
            placeholder="Memory title"
            className="w-full px-2 py-1 rounded bg-gray-800 text-white"
            required
          />
          <textarea
            name="description"
            placeholder="Memory description"
            className="w-full px-2 py-1 rounded bg-gray-800 text-white"
          />
          <input
            type="date"
            name="occurredAt"
            className="px-2 py-1 rounded bg-gray-800 text-white"
            required
          />
          <button
            type="submit"
            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded"
          >
            + New Memory
          </button>
        </form>
      )}

      {lane.memories.length === 0 && (
        <p className="text-gray-500">No memories yet in this lane.</p>
      )}

      <div className="space-y-6">
        {lane.memories
          .sort((a, b) =>
            new Date(a.occurred_at) > new Date(b.occurred_at) ? 1 : -1
          )
          .map((memory) => (
            <div
              key={memory.id}
              className="rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold">{memory.title}</h2>
              <p className="text-sm text-gray-500">
                {new Date(memory.occurred_at).toLocaleDateString()}
              </p>
              {memory.description && (
                <p className="mt-2 text-gray-300">{memory.description}</p>
              )}

              {memory.memory_images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-4">
                  {memory.memory_images.map((img) => (
                    <div
                      key={img.id}
                      className="relative w-48 h-32 rounded overflow-hidden group"
                    >
                      <Image
                        src={img.image_url}
                        alt={img.alt ?? "Memory image"}
                        fill
                        className="object-cover"
                      />
                      {isLoggedIn && (
                        <form
                          action={`/api/images/${img.id}`}
                          method="post"
                          onSubmit={async (e) => {
                            e.preventDefault();
                            await fetch(e.currentTarget.action, {
                              method: "DELETE",
                            });
                            window.location.reload();
                          }}
                        >
                          <button
                            type="submit"
                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-xs px-2 py-1 rounded opacity-80 group-hover:opacity-100 transition"
                          >
                            🗑
                          </button>
                        </form>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {isLoggedIn && (
                <form
                  action="/api/images"
                  method="post"
                  encType="multipart/form-data"
                  className="mt-4 flex items-center space-x-2"
                >
                  <input type="hidden" name="memoryId" value={memory.id} />
                  <input
                    type="file"
                    name="file"
                    accept="image/*"
                    className="text-sm text-gray-300"
                    required
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                  >
                    Upload Image
                  </button>
                </form>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
