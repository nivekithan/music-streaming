import { Form, Link } from "@remix-run/react";
import { isLoggedUserData, useUserData } from "~/hooks/useUserData";

export type NavBarProps = {
  isLoggedIn: boolean;
  url: string; // Url of the page
};

export const NavBar = ({ isLoggedIn, url }: NavBarProps) => {
  const redirectToSearchParam = new URLSearchParams([
    ["redirectTo", new URL(url).pathname],
  ]);

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
          {isLoggedIn ? (
            <Form method="post" action="/logout">
              <button type="submit" className="bg-blue-600 px-2 py-1 rounded">
                Logout
              </button>
            </Form>
          ) : (
            <Link
              to={`/login?${redirectToSearchParam}`}
              className="bg-blue-600 px-2 py-1 rounded"
            >
              Log In
            </Link>
          )}
        </li>
      </ul>
    </div>
  );
};
