import { authOptions } from "@/lib/auth/config";
import { getServerSession } from "next-auth";
import DynamicSideBar from "./dynamic-side-bar";

const SideBar = async () => {
  const data = await getServerSession(authOptions);
  const user = data?.user
  return <DynamicSideBar user={user} />;
};

export default SideBar;
