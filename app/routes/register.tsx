import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import { supabaseClient } from "~/server/supabase.server";
import type { definitions } from "~/types/supabase";
import bcrypt from "bcryptjs";
import { GetUserNameAndPassword } from "~/components/getUsernameAndPassword";
import {
  getCommitedUserIdSession,
  getUserId,
  ifLoggedInRedirect,
  vaildatePassword,
  validateUserName,
} from "~/server/userSession.server";
import { badRequest, unexpectedError } from "~/server/utils.server";
import { nanoid } from "nanoid";

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
    .select("name")
    .eq("name", userName);

  if (data === null) {
    return unexpectedError({
      formError: "Something is wrong with servers please try again later",
    });
  }

  if (data.length !== 0) {
    return badRequest({
      fieldErrors: {
        password: undefined,
        userName: "Provided username already has an account associated with it",
      },
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = nanoid();

  const { error } = await supabaseClient
    .from<definitions["Users"]>("Users")
    .insert({ name: userName, passwordHash, userId });

  if (error !== null) {
    return unexpectedError<ActionData>({
      formError: "Something is wrong with servers please try agin later",
    });
  }

  const userIdSession = await getCommitedUserIdSession(userId);

  return redirect(redirectTo, { headers: { "Set-Cookie": userIdSession } });
};

export default function RegisterRoute() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");

  const data = useActionData<ActionData>();
  return (
    <div className="my-10">
      <Form method="post" className="grid place-content-center">
        <GetUserNameAndPassword
          logInType="Register"
          fieldErrors={data?.fieldErrors}
          formError={data?.formError}
          redirectTo={redirectTo === null ? undefined : redirectTo}
        />
      </Form>
    </div>
  );
}
