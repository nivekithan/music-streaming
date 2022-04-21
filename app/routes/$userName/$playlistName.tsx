import { json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getUserName, requirePlaylists } from "~/server/prisma.server";
import { requireUserId } from "~/server/userSession.server";

type LoaderData = {
  username: string;
  playlistName: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const playlists = await requirePlaylists(userId, request);

  const username = params.userName;
  const playlistName = params.playlistName;

  if (username === undefined || playlistName === undefined) {
    throw Error(
      "Make sure that nested Routing has hierarchy $userName/$playlistName.tsx"
    );
  }
  const hasPlaylist = playlists.some((value) => value.name === playlistName);

  if (!hasPlaylist) {
    return redirect(`/${username}`);
  }

  return json<LoaderData>({ username, playlistName });
};

export default function PlaylistPage() {
  const { username, playlistName } = useLoaderData<LoaderData>();

  return (
    <div>
      {username} : {playlistName}
    </div>
  );
}
