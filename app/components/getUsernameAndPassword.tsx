import { Link } from "@remix-run/react";

export type LoginProps = {
  actionType: "Login" | "Register";
  formError?: string;
  fieldErrors?: {
    userName: string | undefined;
    password: string | undefined;
  };
  redirectTo?: string;
};

export const GetUserNameAndPassword = ({
  actionType,
  formError,
  fieldErrors,
  redirectTo,
}: LoginProps) => {
  const redirectSearchParams =
    redirectTo === undefined
      ? new URLSearchParams()
      : new URLSearchParams([["redirectTo", redirectTo]]);

  return (
    <div className="max-w-md shadow-lg rounded-lg">
      {formError === undefined ? null : (
        <div className="py-2 bg-red-500 rounded grid place-content-center">
          {formError}
        </div>
      )}

      <div className="p-7">
        {/* Start of Form with Login or Register based on route */}
        <div className="flex flex-col gap-y-7">
          <div className="flex flex-col gap-y-2">
            <h2 className="text-2xl font-bold">
              {actionType === "Login" ? "Login" : "Register"}
            </h2>
            <p className="text-sm text-gray-600">
              {actionType === "Login"
                ? "Become a member -- so that you can listen to your music from anywhere"
                : "Register to your account -- so that you can continue listen to your music from anywhere"}
            </p>
          </div>
          <div className="border-b-2 border-gray-200"></div>

          <div className="flex flex-col gap-y-3">
            <label htmlFor="username-input">Username</label>
            <div className="flex flex-col gap-y-2">
              <input
                name="userName"
                id="username-input"
                type="text"
                className="rounded-md border-2 border-gray-400 px-2 py-1 focus:outline-2 focus:outline-blue-400 min-w-full"
              />
              {fieldErrors?.userName === undefined ? null : (
                <p className="text-red-600 text-sm">{fieldErrors.userName}</p>
              )}
            </div>
            <label htmlFor="password-input">Password</label>
            <div className="flex flex-col gap-y-2">
              <input
                name="password"
                id="password-input"
                type="password"
                className="rounded-md border-2 border-gray-400 px-2 py-1 focus:outline-2 focus:outline-blue-400"
              />
              {fieldErrors?.password === undefined ? null : (
                <p className="text-red-600 text-sm">{fieldErrors.password}</p>
              )}
            </div>
          </div>
          <input
            type="submit"
            value={
              actionType === "Login"
                ? "Login to your account"
                : "Become a member"
            }
            className="rounded-md bg-emerald-500 px-3 py-2 text-white cursor-pointer hover:bg-emerald-700 focus:outline-2 focus:outline-blue-400 "
          />

          <div className="border-b-2 border-gray-200"></div>
          <p className="mx-auto text-sm">
            {actionType === "Login"
              ? "Dont have an account? "
              : "Already have an account "}
            <Link
              to={
                actionType === "Login"
                  ? `/register?${redirectSearchParams}`
                  : `/login?${redirectSearchParams}`
              }
              className="text-blue-500 cursor-pointer hover:text-blue-700"
            >
              {actionType === "Login" ? "Sign Up" : "Log in"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
