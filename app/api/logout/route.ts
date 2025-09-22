import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";

export async function POST(req: Request) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  session.destroy();
  return Response.redirect(new URL("/lanes", req.url));
}
