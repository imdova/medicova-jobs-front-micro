import { getServerSession } from "next-auth";
import FolderResults from "./foldersResult";
import { authOptions } from "@/lib/auth/config";
import { notFound } from "next/navigation";
import { getPaginatedFolders } from "@/lib/actions/employer.actions";

const Page = async () => {
  const data = await getServerSession(authOptions);
  const user = data?.user;
  if (!user?.companyId) return notFound();
  const result = await getPaginatedFolders(user?.companyId);
  const { data: folders } = result.data || { data: [], total: 0 };
  return (
    <div className="w-full px-4 md:px-5">
      <FolderResults
        folders={folders}
        total={result.data?.total || 0}
        companyId={user?.companyId}
      />
    </div>
  );
};

export default Page;
