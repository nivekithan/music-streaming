import { isLoggedUserData, useUserData } from "~/hooks/useUserData";

export const NavBar = () => {
  const userData = useUserData();
  const isLogged = isLoggedUserData(userData);

  return (
    <div className="bg-green-500 p-3 text-white flex justify-between">
      <span className="grid place-content-center">Music Streaming</span>
      <ul className="flex">
        <li className="mx-2 grid place-content-center hover:text-blue-800">
          <a
            href="https://github.com/nivekithan/music-streaming"
            target="_blank"
          >
            Github source code
          </a>
        </li>
        <li className="mx-2 grid place-content-center">
          <button className="bg-blue-600 px-2 py-1 rounded">
            {isLogged ? "Logout" : "Log In"}
          </button>
        </li>
      </ul>
    </div>
  );
};
