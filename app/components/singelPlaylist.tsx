import { Playlists } from "@prisma/client";

export type SinglePlaylistProps = {
  playlist: Playlists;
};

export const SinglePlaylist = ({ playlist }: SinglePlaylistProps) => {
  return <div>{playlist.name}</div>;
};
