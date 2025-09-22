"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Share2 } from "lucide-react";

interface MemoryImage {
  id: string;
  image_url: string;
  alt: string | null;
}

interface MemoryDetail {
  id: string;
  title: string;
  description: string | null;
  occurred_at: string;
  memory_images: MemoryImage[];
}

interface LaneDetail {
  id: string;
  title: string;
  description: string | null;
  memories: MemoryDetail[];
}

interface LaneClientProps {
  lane: LaneDetail;
  isLoggedIn: boolean;
}

export function LaneClient({ lane, isLoggedIn }: LaneClientProps) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [copied, setCopied] = useState(false);

  const sortedMemories = useMemo(() => {
    return [...lane.memories].sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.occurred_at).getTime() - new Date(b.occurred_at).getTime()
        : new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
    );
  }, [lane.memories, sortOrder]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-3xl space-y-8 px-6 py-12">
        <div className="flex items-center justify-between">
          <Link
            href="/lanes"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm transition hover:bg-gray-200"
          >
            ← Back to lanes
          </Link>
          {!isLoggedIn && (
            <Link
              href="/login"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm transition hover:bg-gray-200"
            >
              Login
            </Link>
          )}
        </div>

        <section className="relative rounded-2xl bg-white p-6 shadow-sm">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold">{lane.title}</h1>
            {lane.description && (
              <p className="text-gray-600 leading-relaxed">{lane.description}</p>
            )}
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-600 shadow-sm transition hover:bg-gray-200"
            >
              <Share2 className="h-4 w-4" />
              {copied ? "Link copied" : "Share"}
            </button>
            {isLoggedIn && (
              <form action={`/api/lanes/${lane.id}`} method="post">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-md border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-500 shadow-sm transition hover:bg-red-500 hover:text-white"
                >
                  Delete lane
                </button>
              </form>
            )}
          </div>
        </section>

        <div className="flex items-center justify-between">
          <select
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition hover:bg-gray-200 focus:border-gray-500 focus:outline-none"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value as "asc" | "desc")}
          >
            <option value="asc">Older to new</option>
            <option value="desc">Newer to old</option>
          </select>

          {isLoggedIn && (
            <a
              href="#new-memory"
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition hover:bg-gray-200"
            >
              + New memory
            </a>
          )}
        </div>

        {isLoggedIn && (
          <section id="new-memory" className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Add a memory</h2>
            <form action="/api/memories" method="post" className="mt-4 space-y-4">
              <input type="hidden" name="laneId" value={lane.id} />
              <input
                type="text"
                name="title"
                placeholder="Memory title"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none"
                required
              />
              <textarea
                name="description"
                placeholder="Memory description"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none"
              />
              <input
                type="date"
                name="occurredAt"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="w-full rounded-md border border-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white"
              >
                Save memory
              </button>
            </form>
          </section>
        )}

        <section className="space-y-8">
          {sortedMemories.length === 0 ? (
            <p className="text-center text-gray-500">
              No memories yet. {isLoggedIn ? "Add one above." : ""}
            </p>
          ) : (
            sortedMemories.map((memory, idx) => {
              const displayDate = new Date(memory.occurred_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              });
              const primaryImage = memory.memory_images[0];

              return (
                <div key={memory.id} className="space-y-6">
                  <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-500">
                        {primaryImage ? (
                          <Image
                            src={primaryImage.image_url}
                            alt={primaryImage.alt ?? "Memory image"}
                            width={64}
                            height={64}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        ) : (
                          <span>No image</span>
                        )}
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">{memory.title}</h3>
                            <p className="text-sm text-gray-500">{displayDate}</p>
                            {memory.description && (
                              <p className="mt-2 text-gray-700">{memory.description}</p>
                            )}
                          </div>

                          {isLoggedIn && (
                            <form action={`/api/memories/${memory.id}`} method="post">
                              <button
                                type="submit"
                                className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-500 transition hover:bg-red-500 hover:text-white"
                              >
                                Delete memory
                              </button>
                            </form>
                          )}
                        </div>

                        {memory.memory_images.length > 0 && (
                          <div className="flex flex-wrap gap-3">
                            {memory.memory_images.map((img) => (
                              <div
                                key={img.id}
                                className="relative h-24 w-32 overflow-hidden rounded-lg border border-gray-100"
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
                                    className="absolute right-2 top-2"
                                  >
                                    <button
                                      type="submit"
                                      className="rounded bg-white px-2 py-1 text-[10px] font-semibold text-red-500 shadow transition hover:bg-red-500 hover:text-white"
                                    >
                                      Remove
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
                            className="flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-sm text-gray-600"
                          >
                            <input type="hidden" name="memoryId" value={memory.id} />
                            <input
                              type="file"
                              name="file"
                              accept="image/*"
                              className="text-sm"
                              required
                            />
                            <button
                              type="submit"
                              className="rounded-md border border-gray-300 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-200"
                            >
                              Upload image
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>

                  {idx < sortedMemories.length - 1 && (
                    <div className="flex justify-center text-gray-400">
                      <span className="text-lg">⋯</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
}
