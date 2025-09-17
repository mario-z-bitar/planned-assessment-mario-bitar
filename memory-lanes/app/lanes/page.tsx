import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/session";

export default async function LanesPage() {
  // get session
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  const isLoggedIn = session.isLoggedIn === true;

  // fetch data
  const lanes = await prisma.lanes.findMany({
    include: {
      memories: true,
    },
    orderBy: { created_at: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Memory Lanes</h1>

        {isLoggedIn ? (
          <form action="/api/logout" method="post">
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-medium"
            >
              Logout
            </button>
          </form>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium"
          >
            Login
          </Link>
        )}
      </div>

      {isLoggedIn && (
        <form action="/api/lanes" method="post" className="mb-8 space-x-2">
          <input
            type="text"
            name="title"
            placeholder="Lane title"
            className="px-2 py-1 rounded bg-gray-800 text-white"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Lane description"
            className="px-2 py-1 rounded bg-gray-800 text-white"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded"
          >
            + New Lane
          </button>
        </form>
      )}

      {lanes.length === 0 && (
        <p className="text-gray-400">No lanes yet. Create one to get started!</p>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {lanes.map((lane) => (
          <div
            key={lane.id}
            className="rounded-2xl border border-gray-800 bg-gray-900 shadow-lg hover:shadow-xl transition"
          >
            <div className="p-6 space-y-3">
              <div>
                <h2 className="text-2xl font-semibold">
                  <Link href={`/lanes/${lane.id}`} className="hover:underline">
                    {lane.title}
                  </Link>
                </h2>
                {lane.description && (
                  <p className="text-gray-400">{lane.description}</p>
                )}
              </div>

              {lane.memories.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 uppercase tracking-wide">
                    Recent Memories
                  </p>
                  <ul className="space-y-1">
                    {lane.memories.slice(0, 3).map((memory) => (
                      <li key={memory.id} className="text-sm">
                        <span className="font-medium">{memory.title}</span> –{" "}
                        {memory.description}
                      </li>
                    ))}
                  </ul>
                  {lane.memories.length > 3 && (
                    <p className="text-xs text-gray-500 italic">
                      + {lane.memories.length - 3} more memories
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
