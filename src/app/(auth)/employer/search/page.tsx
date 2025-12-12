import CvResults from "./cv-results";
import {
  getSeekersFilter,
  searchSeekers,
} from "@/lib/actions/applications.actions";
import CustomPagination from "@/components/UI/CustomPagination";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { getUnlockedSeeker } from "@/lib/actions/employer.actions";
import { Suspense } from "react";
import SeekerFilter from "./seeker-filter";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const {
    q,
    country,
    state,
    page,
    limit,
    ctg,
    nat,
    sp,
    clv,
    gen,
    edu,
    exp,
    age,
  } = params as {
    [key: string]: any;
  };
  const [expFrom, expTo] = exp?.split("-") || [];
  const [ageFrom, ageTo] = age?.split("-") || [];

  const data = await getServerSession(authOptions);
  const user = data?.user;
  const result = await searchSeekers({
    q,
    countryCode: country?.split(","),
    stateCode: state?.split(","),
    nationality: nat?.split(","),
    categoryIds: ctg?.split(","),
    specialityIds: sp?.split(","),
    careerLevelIds: clv?.split(","),
    educationLevel: edu?.split(","),
    gender: gen?.split(","),
    experienceFrom: expFrom,
    experienceTo: expTo,
    ageFrom: ageFrom,
    ageTo: ageTo,
    page: parseInt(page || "1"),
    limit: parseInt(limit || "10"),
  });

  const unLockedSeekersResult = await getUnlockedSeeker(user?.companyId || "");
  const { data: unLockedSeekers } = unLockedSeekersResult || { data: [] };
  const { data: seekers, total } = result.data || { data: [], total: 0 };
  return (
    <div className="flex min-h-screen w-full px-2">
      {/* Left Column: Filter Section */}
      <Suspense fallback={<div> loading</div>}>
        <CvSearchFilter />
      </Suspense>
      {/* Right Column: Results Section */}
      <div className="w-full px-4 lg:w-[80%]">
        <CvResults seekers={seekers} unlockedSeekers={unLockedSeekers?.data || []} total={total} />
        {seekers.length < total && <CustomPagination totalItems={total} />}
      </div>
    </div>
  );
};

const CvSearchFilter = async () => {
  const { data } = await getSeekersFilter();
  if (!data) return null;

  return <SeekerFilter data={data} />;
};

export default page;
