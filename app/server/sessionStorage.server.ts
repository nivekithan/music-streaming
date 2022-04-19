import { createCookieSessionStorage } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET;

if (sessionSecret === undefined)
  throw new Error("Session secret has to be set");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "MS_session",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    secrets : [sessionSecret]
  },
});

export const getUserSession = (request: Request) => {
  return sessionStorage.getSession(request.headers.get("Cookie"));
};
