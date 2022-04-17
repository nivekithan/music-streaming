import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { logout } from "~/server/userSession.server";

export const loader: LoaderFunction = () => {
  return redirect("/");
};

export const action: ActionFunction = ({ request }) => {
  return logout(request);
};
