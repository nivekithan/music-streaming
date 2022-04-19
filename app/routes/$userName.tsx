import { json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUserName } from "~/server/prisma.server";
import { requireUserId } from "~/server/userSession.server";

type LoaderData = {
  userName: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userName = await getUserName(request);
  const urlUsername = params.userName;

  if (urlUsername === undefined)
    throw Error("[Unreachable] Make sure that filename is $userName.tsx");

  if (userName !== urlUsername) {
    return redirect(`/${userName}`);
  }

  return json({ userName });
};

export default function HomePage() {
  const { userName } = useLoaderData<LoaderData>();
  return (
    <div className="mx-[20%] my-8 flex flex-col">
      <h1 className="font-semibold text-3xl text-emerald-700">
        {userName} Playlist
      </h1>
      <div></div>
    </div>
  );
}
