"use client";

import { useState } from "react";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.href = "/lanes";
    } else {
      setError("Invalid password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-12">
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="h-6 w-6 rounded-lg bg-gray-900" />
          </div>
          <div>
            <h1 className="text-3xl font-semibold">Memory lane editor</h1>
            <p className="mt-1 text-sm text-gray-500">
              Enter the shared passphrase to manage journeys and memories.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow"
        >
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-600">
              Editor password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-gray-500 focus:outline-none"
              placeholder="••••••••"
              autoFocus
            />
          </div>

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full rounded-md border border-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white"
          >
            Sign in
          </button>

          <p className="text-center text-xs text-gray-400">
            Access is limited to the shared editorial team.
          </p>
        </form>
      </div>
    </div>
  );
}
