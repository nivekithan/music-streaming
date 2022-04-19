import { LoaderFunction, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { getUserName } from "~/server/prisma.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userName = await getUserName(request);


  return redirect(`/${userName}`);
};

export default function Index() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
