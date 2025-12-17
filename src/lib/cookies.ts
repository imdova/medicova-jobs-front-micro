"use server";

import { cookies } from "next/headers";

export async function setCookies(name: string, value: string) {
  (await cookies()).set(name, value);
}
export async function getCookies(name: string) {
  const data = (await cookies()).get(name);
  return data?.value;
}
export async function deleteCookies(name: string) {
  (await cookies()).delete(name);
}
