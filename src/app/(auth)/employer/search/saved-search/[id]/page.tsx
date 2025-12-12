import Image from "next/image";
import CustomPagination from "@/components/UI/CustomPagination";
import Filter from "@/components/Layout/filter/filter";
import { filterSections } from "@/constants";
import { notFound } from "next/navigation";
import {
  getFolderById,
  getPaginatedCandidatesByFolderId,
} from "@/lib/actions/employer.actions";
import FolderDetails from "./folder-details";
import { getFolderFilter } from "@/lib/actions/applications.actions";
import FolderFilter from "./folder-filter";
import { Suspense } from "react";

const page = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const { q, country, page, limit, edu, gen, exp, sp } = searchParams as {
    [key: string]: any;
  };

  const id = params.id;
  const result = await getFolderById(id);
  if (!result.success || !result.data) return notFound;
  const folder = result.data;
  const [expFrom, expTo] = exp?.split("-") || [];
  const candidateResult = await getPaginatedCandidatesByFolderId({
    folderId: id,
    q,
    countryCode: country?.split(","),
    specialityIds: sp?.split(","),
    educationLevel: edu?.split(","),
    gender: gen?.split(","),
    experienceFrom: expFrom,
    experienceTo: expTo,
    page: parseInt(page || "1"),
    limit: parseInt(limit || "10"),
  });
  const { data: candidates, total } = candidateResult.data || {
    data: [],
    total: 0,
  };

  return (
    <div className="flex min-h-screen w-full px-2">
      <Suspense fallback={<div> loading</div>}>
        <FolderFilters id={id} />
      </Suspense>

      {/* <Filter sections={filterSections} /> */}
      {/* Right Column: Results Section */}
      <div className="w-full p-2 md:p-4 lg:w-[80%]">
        <div className="mb-5 flex w-full gap-3 pl-[32px]">
          <Image
            src={"/images/folder.svg"}
            alt="save"
            className="object-contain"
            width={24}
            height={24}
          />
          <h2 className="text-xl font-semibold text-main">{folder.name}</h2>
        </div>
        <FolderDetails candidates={candidates} />
        {/* Pagination */}
        {candidates.length < total && <CustomPagination totalItems={total} />}
      </div>
    </div>
  );
};

const FolderFilters = async ({ id }: { id: string }) => {
  const { data } = await getFolderFilter(id);
  if (!data) return null;

  return <FolderFilter data={data} />;
};

export default page;
