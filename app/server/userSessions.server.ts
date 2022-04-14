import { hash } from "bcryptjs";
import { nanoid } from "nanoid";
import { definitions } from "~/types/supabase";
import { supabaseClient } from "./supabase.server";

/**
 * This does not validate userName or password.
 *
 * If there is no error, this stores the userId in session
 */
export const registerUser = async (userName: string, password: string) => {
  const hashedPassword = await hash(password, 10);
  const userId = nanoid();
  const { error } = await supabaseClient
    .from<definitions["Users"]>("Users")
    .insert({ name: userName, passwordHash: hashedPassword, userId });

  return error;
};
