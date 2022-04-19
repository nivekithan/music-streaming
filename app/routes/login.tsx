import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
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
import { prisma } from "~/server/prisma.server";

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

  const user = await prisma.users.findUnique({
    where: { name: userName },
    select: { passwordHash: true, userId: true },
  });

  if (user === null) {
    return badRequest({
      fieldErrors: {
        password: undefined,
        userName: "Please provide a valid username",
      },
    });
  }

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isCorrectPassword) {
    return badRequest({
      fieldErrors: {
        userName: undefined,
        password: "Password provided does not match username",
      },
    });
  }

  const userId = user.userId;
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
          actionType="Login"
          formError={data?.formError}
          fieldErrors={data?.fieldErrors}
          redirectTo={redirectTo === null ? undefined : redirectTo}
        />
      </Form>
    </div>
  );
}
