import FolderMainCard from "@/components/UI/folder-main-card";
import { getPaginatedFolders } from "@/lib/actions/employer.actions";
import { East } from "@mui/icons-material";
import Link from "next/link";

const INITIAL_FOLDERS = 6;
const FolderSection = async ({ companyId }: { companyId: string }) => {
  const result = await getPaginatedFolders(companyId);
  const { data: folders } = result.data || { data: [], total: 0 };
  return (
    <div>
      <h2 className="mb-5 mt-10 text-3xl font-semibold text-main">
        CV Search{" "}
        <span className="mt-5 text-3xl font-semibold text-secondary">
          Folders
        </span>
      </h2>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
        {folders.slice(0, INITIAL_FOLDERS).map((folder, index) => (
          <FolderMainCard key={index} folder={folder} />
        ))}
      </div>
      {folders.length > INITIAL_FOLDERS && (
        <div className="flex w-full justify-center">
          <Link
            href="/employer/search/saved-search"
            className="group my-2 mt-5 text-xl text-primary hover:underline"
          >
            All Folders
            <East className="mx-2 inline-block transition group-hover:translate-x-3" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default FolderSection;
