import { getSafeServerSession } from "@/lib/auth/utils";
import HeaderSelector from "./SelectedHeader";

const DynamicHeader = async () => {
  const data = await getSafeServerSession();
  const user = data?.user;

  return <HeaderSelector user={user} />;
};

export default DynamicHeader;
