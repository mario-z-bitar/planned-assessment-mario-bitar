import { SessionOptions } from "iron-session";

export interface SessionData {
  isLoggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.IRON_SESSION_PASSWORD as string,
  cookieName: "memory_lanes_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
