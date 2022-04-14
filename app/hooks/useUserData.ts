export type UserData = LoggedUserData | UnknownUserData;

export type LoggedUserData = {
  userName: string;
};

export type UnknownUserData = {};

export const useUserData = (): UserData => {
  return { userName: "Nivekithan S" };
};

export const isLoggedUserData = (
  userData: UserData
): userData is LoggedUserData => {
  return (userData as LoggedUserData).userName !== undefined;
};
