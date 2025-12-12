"use server";

import { cookies } from "next/headers";

export async function setCookies(name: string, value: string) {
  cookies().set(name, value);
}
export async function getCookies(name: string) {
  const data = cookies().get(name);
  return data?.value;
}
export async function deleteCookies(name: string) {
  cookies().delete(name);
}
