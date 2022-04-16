import { ActionFunction, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { supabaseClient } from "~/server/supabase.server";
import type { definitions } from "~/types/supabase";
import bcrypt from "bcryptjs";
import { GetUserNameAndPassword } from "~/components/getUsernameAndPassword";
import { vaildatePassword, validateUserName } from "~/server/userUtils.server";
import { badRequest, unexpectedError } from "~/server/utils.server";

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

  return redirect(redirectTo);
};

export default function LoginRoute() {
  const data = useActionData<ActionData>();
  return (
    <div className="my-10">
      <Form method="post" className="grid place-content-center">
        <GetUserNameAndPassword
          logInType="Login"
          formError={data?.formError}
          fieldErrors={data?.fieldErrors}
        />
      </Form>
    </div>
  );
}
