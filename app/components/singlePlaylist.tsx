import { Playlists } from "@prisma/client";
import { Form, Link } from "@remix-run/react";
import { CloseSvg, OpenSvg, MusicSvg } from "./svg";

export type SinglePlaylistProps = {
  playlist: Playlists;
};

export const SinglePlaylist = ({ playlist }: SinglePlaylistProps) => {
  return (
    <Form method="post">
      <div className="px-3 py-2 bg-gray-200 bg-opacity-30 rounded-md flex justify-between content-center font-semibold border-2 border-gray-200 hover:border-blue-500">
        <input hidden name="playListName" value={playlist.name} readOnly />
        <span className="grid place-content-center">{playlist.name}</span>
        <div className="flex gap-x-2">
          <button
            name="actionType"
            value="startPlaylist"
            type="submit"
            className="p-1 bg-blue-100 border-[1px] border-blue-300 hover:bg-blue-200 rounded-md"
          >
            {MusicSvg}
          </button>
          <button
            name="actionType"
            value="openPlaylist"
            type="submit"
            className="p-1 bg-blue-100 border-[1px] border-blue-300 hover:bg-blue-200 rounded-md"
          >
            {OpenSvg}
          </button>
          <button
            name="actionType"
            value="deletePlaylist"
            type="submit"
            className="p-1 bg-blue-100 border-[1px] border-blue-300 hover:bg-blue-200 rounded-md"
          >
            {CloseSvg}
          </button>
        </div>
      </div>
    </Form>
  );
};
