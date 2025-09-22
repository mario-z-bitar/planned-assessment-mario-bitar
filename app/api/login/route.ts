import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";

export async function POST(req: Request) {
  const { password } = await req.json();

  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  if (password === process.env.ADMIN_PASSWORD) {
    session.isLoggedIn = true;
    await session.save();
    return new Response("ok", { status: 200 });
  }

  return new Response("unauthorized", { status: 401 });
}