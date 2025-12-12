import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import HeaderSelector from "./SelectedHeader";

const DynamicHeader = async () => {
  const data = await getServerSession(authOptions);
  const user = data?.user

  return <HeaderSelector user={user} />;
};

export default DynamicHeader;
