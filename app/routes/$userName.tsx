import { Playlists } from "@prisma/client";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { SinglePlaylist } from "~/components/singelPlaylist";
import { getUserName, prisma, requirePlaylists } from "~/server/prisma.server";
import { getUserId, requireUserId } from "~/server/userSession.server";
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

  newPlayListValue: string;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const newPlaylistName = formData.get("newPlaylist");

  if (newPlaylistName === null || typeof newPlaylistName !== "string")
    return badRequest<ActionData>({
      newPlayListError: "Enter valid playlist name",
      newPlayListValue: "",
    });

  const userId = await requireUserId(request);

  const isPlaylistNameAlreadyPresent = await prisma.playlists.findFirst({
    where: { usersId: userId, name: newPlaylistName },
  });

  if (isPlaylistNameAlreadyPresent !== null) {
    return badRequest<ActionData>({
      newPlayListError: `There is already playlist with name ${newPlaylistName}, Please choose another name`,
      newPlayListValue: newPlaylistName,
    });
  }

  await prisma.playlists.create({
    data: { name: newPlaylistName, usersId: userId },
  });

  return json<ActionData>({ newPlayListValue: "" });
};

export default function HomePage() {
  const { userName, playlist } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  return (
    <div className="mx-[20%] my-8 flex flex-col gap-y-5">
      <h1 className="font-semibold text-3xl text-emerald-700">
        {userName} Playlists
      </h1>
      <Form method="post">
        <div>
          <label htmlFor="new-playlist-input" hidden />
          <div className="flex gap-x-2">
            <input
              type="text"
              id="new-playlist-input"
              name="newPlaylist"
              className="rounded-md border-2 border-gray-400 px-2 py-1 focus:outline-2 focus:outline-blue-400 grow"
              placeholder="New Playlist name"
              defaultValue={actionData?.newPlayListValue}
            />
            <button
              type="submit"
              className="bg-blue-500 px-3 py-2 text-white rounded-md"
            >
              Make new playlist
            </button>
          </div>
        </div>
      </Form>
      <ol>
        {playlist.map((playlist) => {
          return <SinglePlaylist playlist={playlist} key={playlist.id} />;
        })}
      </ol>
    </div>
  );
}
