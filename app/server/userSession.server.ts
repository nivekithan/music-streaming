/**
 * Contains functions for managing user, this includes
 *    - Functions for validating userName and Password
 *    - Functions for creating and managing user session
 *
 */

import { redirect } from "@remix-run/node";
import { getUserSession, sessionStorage } from "./sessionStorage.server";

export const validateUserName = (userName: string): string | undefined => {
  if (userName.length < 3) {
    return "Username has to be atleast length 3";
  }
};

export const vaildatePassword = (password: string): string | undefined => {
  if (password.length < 3) {
    return "Password has to be atleast length 3";
  }
};

export const getCommitedUserIdSession = async (userId: string) => {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  const commitedSession = await sessionStorage.commitSession(session);
  return commitedSession;
};

export const getUserId = async (request: Request) => {
  const userSession = await getUserSession(request);
  const userId = userSession.get("userId");

  if (typeof userId !== "string" || !userId) return null;
  return userId;
};

export const requireUserId = async (request: Request) => {
  const userId = await getUserId(request);

  if (userId === null) {
    const requestOriginatedFrom = new URL(request.url).pathname;
    const loginPageUrl = `/login?${new URLSearchParams([
      ["redirectTo", requestOriginatedFrom],
    ])}`;

    throw redirect(loginPageUrl);
  }

  return userId;
};
