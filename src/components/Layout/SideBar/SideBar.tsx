import { getSafeServerSession } from "@/lib/auth/utils";
import DynamicSideBar from "./dynamic-side-bar";

const SideBar = async () => {
  const data = await getSafeServerSession();
  const user = data?.user;
  return <DynamicSideBar user={user} />;
};

export default SideBar;
