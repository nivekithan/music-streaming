import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { useEffect } from "react";
import { supabaseClient } from "~/server/supabase.server";
import type { definitions } from "~/types/supabase";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { registerUser } from "../server/userSessions.server";

type ActionData = {
  formError?: string;
  fieldErrors?: {
    userName: string | undefined;
    password: string | undefined;
  };
};

const validateUserName = (userName: string): string | undefined => {
  if (userName.length < 3) {
    return "Username has to be atleast length 3";
  }
};

const vaildatePassword = (password: string): string | undefined => {
  if (password.length < 3) {
    return "Password has to be atleast length 3";
  }
};

const badRequest = (data: ActionData) => {
  return json(data, { status: 400 });
};

const unexpectedError = (data: ActionData) => {
  return json(data, { status: 500 });
};

export const action: ActionFunction = async ({ request }) => {
  const requestUrl = new URL(request.url);
  const redirectToParam = requestUrl.searchParams.get("redirectTo");
  const redirectTo = redirectToParam === null ? "/" : redirectToParam;

  const form = await request.formData();

  const loginType = await form.get("loginType");
  const userName = await form.get("userName");
  const password = await form.get("password");

  if (
    typeof loginType !== "string" ||
    typeof userName !== "string" ||
    typeof password !== "string"
  )
    return badRequest({ formError: "Form not submitted correctly" });

  const fieldErrors: ActionData["fieldErrors"] = {
    userName: validateUserName(userName),
    password: vaildatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors });
  }

  switch (loginType) {
    case "register":
      const { data } = await supabaseClient
        .from<definitions["Users"]>("Users")
        .select("name")
        .eq("name", userName);

      if (data === null) {
        return unexpectedError({
          formError: "Something is wrong with server please try again later",
        });
      }
      if (data.length !== 0) {
        return badRequest({
          fieldErrors: {
            userName: `There is already a user with name ${userName}`,
            password: undefined,
          },
        });
      }
      const error = await registerUser(userName, password);

      if (error !== null) {
        return unexpectedError({
          formError: "Something is gone wrong, please try again later",
        });
      }

      return redirect(redirectTo);
  }
};

export default function Login() {
  return (
    <div>
      <Form method="post" className="flex gap-x-3">
        <label className="flex items-center gap-x-1">
          <input type="radio" name="loginType" value="login" />{" "}
          <span>Login</span>
        </label>
        <label className="flex items-center gap-x-1">
          <input type="radio" name="loginType" value="register" /> Register
        </label>
      </Form>
    </div>
  );
}
