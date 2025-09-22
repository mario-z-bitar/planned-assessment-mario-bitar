"use client";

import Link from "next/link";

type MemorySummary = {
  id: string;
  title: string;
  description: string | null;
  occurred_at: string;
};

type LaneSummary = {
  id: string;
  title: string;
  description: string | null;
  memories: MemorySummary[];
};

interface LanesClientProps {
  lanes: LaneSummary[];
  isLoggedIn: boolean;
}

export function LanesClient({ lanes, isLoggedIn }: LanesClientProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-14">
        <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="h-6 w-6 rounded-lg bg-gray-900" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Memory Lanes</h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600">
                  Curate stories in living collections. Each lane keeps its memories ready for friends and family to explore.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <form action="/api/logout" method="post">
                <button
                  type="submit"
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm transition hover:bg-gray-200"
                >
                  Logout
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm transition hover:bg-gray-200"
              >
                Login to edit
              </Link>
            )}
          </div>
        </header>

        {isLoggedIn && (
          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Create a lane</h2>
            <p className="mt-1 text-sm text-gray-500">
              Give it a name and short description to help viewers understand the theme.
            </p>
            <form action="/api/lanes" method="post" className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600" htmlFor="lane-title">
                  Lane title
                </label>
                <input
                  id="lane-title"
                  name="title"
                  type="text"
                  placeholder="Trip to Madrid"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-600" htmlFor="lane-description">
                  Description
                </label>
                <input
                  id="lane-description"
                  name="description"
                  type="text"
                  placeholder="Moments from our fall adventure"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none"
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  className="rounded-md border border-gray-900 px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-900 hover:text-white"
                >
                  Create lane
                </button>
              </div>
            </form>
          </section>
        )}

        {lanes.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">
            No lanes yet. {isLoggedIn ? "Use the form above to start one." : "Ask an editor to add the first lane."}
          </p>
        ) : (
          <section className="space-y-6">
            {lanes.map((lane) => {
              const latestMemory = lane.memories[0];
              return (
                <article
                  key={lane.id}
                  className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2">
                      <Link
                        href={`/lanes/${lane.id}`}
                        className="text-xl font-semibold text-gray-900 transition hover:text-gray-700"
                      >
                        {lane.title}
                      </Link>
                      {lane.description && (
                        <p className="text-sm text-gray-600">{lane.description}</p>
                      )}
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                        {lane.memories.length} {lane.memories.length === 1 ? "memory" : "memories"}
                      </p>
                    </div>

                    {isLoggedIn && (
                      <form action={`/api/lanes/${lane.id}`} method="post">
                        <button
                          type="submit"
                          className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-500 shadow-sm transition hover:bg-red-500 hover:text-white"
                        >
                          Delete lane
                        </button>
                      </form>
                    )}
                  </div>

                  {latestMemory && (
                    <Link
                      href={`/lanes/${lane.id}`}
                      className="block rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600 transition hover:border-gray-200"
                    >
                      <span className="font-medium text-gray-700">{latestMemory.title}</span>
                      {latestMemory.description ? ` — ${latestMemory.description}` : ""}
                    </Link>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </div>
    </div>
  );
}
