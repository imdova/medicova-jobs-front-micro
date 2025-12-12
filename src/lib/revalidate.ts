"use server";

import { revalidateTag as revalidate, revalidatePath as revalidateThePath } from "next/cache";

async function revalidateTag(tag: string) {
  revalidate(tag);
}
async function revalidatePath(path: string) {
  revalidateThePath(path);
}

export default revalidateTag;
