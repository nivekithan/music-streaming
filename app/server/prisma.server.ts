import { PrismaClient } from "@prisma/client";
import { getUserId, logout, requireUserId } from "./userSession.server";

export let prisma: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
  }
  prisma = global.__db;
}

export const getUserName = async (request: Request) => {
  const userId = await requireUserId(request);
  const user = await prisma.users.findUnique({
    where: { userId },
    select: { name: true },
  });

  if (user === null) {
    throw await logout(request);
  }

  return user.name;
};

export const requirePlaylists = async (userId: string, request: Request) => {
  const userPlaylists = await getPlaylists(userId);

  if (userPlaylists === null) {
    throw await logout(request);
  }

  return userPlaylists;
};

export const getPlaylists = async (userId: string) => {
  const userPlaylist = await prisma.users.findUnique({
    where: { userId },
    select: { playlists: true },
  });

  if (userPlaylist === null) return null;

  return userPlaylist.playlists;
};

export const requireMusic = async (
  userId: string,
  playlistName: string,
  request: Request
) => {
  const musics = await getMusics(userId, playlistName);

  if (musics === null) {
    throw await logout(request);
  }

  return musics;
};

export const getMusics = async (userId: string, playlistName: string) => {
  const userPlaylist = await prisma.users.findUnique({
    where: { userId },
    select: {
      playlists: { select: { music: true }, where: { name: playlistName } },
    },
  });

  if (userPlaylist === null) {
    return null;
  }

  console.log(userId, playlistName);

  return userPlaylist.playlists[0].music;
};
