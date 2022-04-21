import { Music } from "@prisma/client";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  getUserName,
  requireMusic,
  requirePlaylists,
} from "~/server/prisma.server";
import { requireUserId } from "~/server/userSession.server";

type LoaderData = {
  username: string;
  playlistName: string;
  music: Music[];
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

  const musics = await requireMusic(userId, playlistName, request);

  return json<LoaderData>({ username, playlistName, music: musics });
};

export default function PlaylistPage() {
  const { username, playlistName } = useLoaderData<LoaderData>();

  return (
    <div>
      {username} : {playlistName}
    </div>
  );
}
