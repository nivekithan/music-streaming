import { LoaderFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { NavBar } from "~/components/navBar";
import { requireUserId } from "~/server/userSession.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  return null;
};

export default function Index() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
