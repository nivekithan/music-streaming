import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { supabaseClient } from "~/server/supabase.server";
import type { definitions } from "~/types/supabase";
import bcrypt from "bcryptjs";
import { GetUserNameAndPassword } from "~/components/getUsernameAndPassword";
import {
  getUserId,
  ifLoggedInRedirect,
  vaildatePassword,
  validateUserName,
} from "~/server/userSession.server";
import { badRequest, unexpectedError } from "~/server/utils.server";
import { getCommitedUserIdSession } from "~/server/userSession.server";

export const loader: LoaderFunction = async ({ request }) => {
  await ifLoggedInRedirect(request);

  return null;
};

type ActionData = {
  formError?: string;
  fieldErrors?: {
    userName: string | undefined;
    password: string | undefined;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const requestUrl = new URL(request.url);
  const redirectToParam = requestUrl.searchParams.get("redirectTo");
  const redirectTo = redirectToParam === null ? "/" : redirectToParam;

  const form = await request.formData();

  const userName = await form.get("userName");
  const password = await form.get("password");

  if (typeof userName !== "string" || typeof password !== "string")
    return badRequest({ formError: "Form not submitted correctly" });

  const fieldErrors: ActionData["fieldErrors"] = {
    userName: validateUserName(userName),
    password: vaildatePassword(password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors });
  }

  const { data } = await supabaseClient
    .from<definitions["Users"]>("Users")
    .select("name,passwordHash,userId")
    .eq("name", userName);

  if (data === null) {
    return unexpectedError({
      formError: "Something is wrong with servers please try again later",
    });
  }

  if (data.length === 0) {
    return badRequest({
      fieldErrors: {
        password: undefined,
        userName: "Please provide a valid username",
      },
    });
  }

  const isCorrectPassword = await bcrypt.compare(
    password,
    data[0].passwordHash
  );

  if (!isCorrectPassword) {
    return badRequest({
      fieldErrors: {
        userName: undefined,
        password: "Password provided does not match username",
      },
    });
  }

  const userId = data[0].userId;
  const userIdSession = await getCommitedUserIdSession(userId);

  return redirect(redirectTo, { headers: { "Set-Cookie": userIdSession } });
};

export default function LoginRoute() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const data = useActionData<ActionData>();
  return (
    <div className="my-10">
      <Form method="post" className="grid place-content-center">
        <GetUserNameAndPassword
          logInType="Login"
          formError={data?.formError}
          fieldErrors={data?.fieldErrors}
          redirectTo={redirectTo === null ? undefined : redirectTo}
        />
      </Form>
    </div>
  );
}
