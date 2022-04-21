import { Playlists } from "@prisma/client";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { SinglePlaylist } from "~/components/singlePlaylist";
import { getUserName, prisma, requirePlaylists } from "~/server/prisma.server";
import { requireUserId } from "~/server/userSession.server";
import { badRequest } from "~/server/utils.server";

type LoaderData = {
  userName: string;
  playlist: Playlists[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const userName = await getUserName(request);
  const playlist = await requirePlaylists(userId, request);

  const urlUsername = params.userName;

  if (urlUsername === undefined)
    throw Error("[Unreachable] Make sure that filename is $userName.tsx");

  if (userName !== urlUsername) {
    return redirect(`/${userName}`);
  }

  return json<LoaderData>({ userName, playlist });
};

type ActionData = {
  newPlayListError?: string;
  actionError?: string;
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  const username = params.userName;

  if (username === undefined)
    return badRequest<ActionData>({
      actionError: "Make sure that nesting hireachy is $userName",
    });

  const userId = await requireUserId(request);

  const actionType = formData.get("actionType");

  if (actionType === null || typeof actionType !== "string")
    return badRequest<ActionData>({
      actionError: "Expected actionType to be also sent",
    });

  if (actionType === "createPlaylist") {
    const newPlaylistName = formData.get("newPlaylist");

    if (newPlaylistName === null || typeof newPlaylistName !== "string")
      return badRequest<ActionData>({
        newPlayListError: "Enter valid playlist name",
      });

    const trimedPlaylistName = newPlaylistName.trim();

    if (trimedPlaylistName === "") {
      return badRequest<ActionData>({
        newPlayListError: "Playlist name is empty",
      });
    }

    const isPlaylistNameAlreadyPresent = await prisma.playlists.findFirst({
      where: { usersId: userId, name: trimedPlaylistName },
    });

    if (isPlaylistNameAlreadyPresent !== null) {
      return badRequest<ActionData>({
        newPlayListError: `There is already playlist with name ${trimedPlaylistName}, Please choose another name`,
      });
    }

    await prisma.playlists.create({
      data: { name: trimedPlaylistName, usersId: userId },
    });
  } else {
    const playlistName = formData.get("playListName");

    if (playlistName === null || typeof playlistName !== "string") {
      return badRequest<ActionData>({
        actionError: "Set form variable playListName",
      });
    }

    if (actionType === "deletePlaylist") {
      const playListId = await prisma.playlists.findFirst({
        where: { name: playlistName, usersId: userId },
        select: { id: true },
      });

      if (playListId === null) {
        return badRequest<ActionData>({
          actionError: `There is no playlist with name ${playlistName}`,
        });
      }

      await prisma.playlists.delete({ where: { id: playListId.id } });
    } else if (actionType === "startPlaylist") {
    } else if (actionType === "openPlaylist") {
      return redirect(`/${username}/${playlistName}`);
    }
  }

  return json<ActionData>({});
};

export default function Playlist() {
  const { userName, playlist } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  return (
    <div className="mx-[20%] my-8 flex flex-col gap-y-5">
      <h1 className="font-semibold text-3xl text-emerald-700">
        {userName} Playlists
      </h1>
      <Form method="post" className="my-4">
        <label htmlFor="new-playlist-input" hidden />
        <div className="flex gap-x-2">
          <input hidden name="actionType" value="createPlaylist" readOnly />
          <div className="flex grow relative">
            <input
              type="text"
              id="new-playlist-input"
              name="newPlaylist"
              className="rounded-md border-2 border-gray-400 px-2 py-1 focus:outline-2 focus:outline-blue-400 grow"
              placeholder="New playlist name"
            />
            <p className="absolute -bottom-6 left-2 text-sm text-red-600 ">
              {actionData?.newPlayListError}
            </p>
          </div>
          <button
            type="submit"
            className="bg-blue-500 px-3 py-2 text-white rounded-md"
          >
            Make new playlist
          </button>
        </div>
      </Form>
      <ol className="flex flex-col gap-y-2">
        {playlist.map((playlist) => {
          return <SinglePlaylist playlist={playlist} key={playlist.id} />;
        })}
      </ol>
    </div>
  );
}
