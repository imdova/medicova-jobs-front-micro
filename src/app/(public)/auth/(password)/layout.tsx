import { authOptions } from "@/lib/auth/config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  // const data = await getServerSession(authOptions);
  // const user = data?.user
  // if (!user) {
  //   redirect("/auth/login");
  // }
  return <div>{children}</div>;
}
