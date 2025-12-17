"use server";

import { revalidateTag, revalidatePath as revalidateThePath } from "next/cache";

async function revalidateTagWrapper(tag: string) {
  await revalidateTag(tag, {});
}
async function revalidatePath(path: string) {
  await revalidateThePath(path);
}

export default revalidateTagWrapper;
