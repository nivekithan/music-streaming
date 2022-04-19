import { PrismaClient } from "@prisma/client";
import { getUserId, logout, requireUserId } from "./userSession.server";

export const prisma = new PrismaClient();

export const getUserName = async (request: Request) => {
  const userId = await requireUserId(request);
  const record = await prisma.users.findUnique({
    where: { userId },
    select: { name: true },
  });

  if (record === null) {
    throw await logout(request);
  }


  return record.name;
};
