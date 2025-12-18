import { getSafeServerSession } from "@/lib/auth/utils";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const data = await getSafeServerSession();
  const user = data?.user;
  if (user && user.id) {
    redirect("/");
  }
  return <div>{children}</div>;
}
