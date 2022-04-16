import { json } from "@remix-run/node";

export const badRequest = <ActionData>(data: ActionData) => {
  return json(data, { status: 400 });
};

export const unexpectedError = <ActionData>(data: ActionData) => {
  return json(data, { status: 500 });
};
