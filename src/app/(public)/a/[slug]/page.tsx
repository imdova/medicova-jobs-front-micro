import { getJobFilters, searchJobs } from "@/lib/actions/job.actions";
import JobFilter from "../../search/components/JobFilter";
import JobsResult from "../../search/jobsResult";
import CustomPagination from "@/components/UI/CustomPagination";
import { Suspense } from "react";
import CountrySearchResult from "@/components/UI/CountrySearchResult";

const page = async ({
  params: { slug },
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const {
    q,
    country,
    state,
    page,
    limit,
    ctg,
    ind,
    sp,
    clv,
    emp,
    wp,
    gen,
    edu,
    sal,
    age,
  } = searchParams as {
    [key: string]: any;
  };

  const [salaryFrom, salaryTo] = sal?.split("-") || [];
  const [ageFrom, ageTo] = age?.split("-") || [];
  const result = await searchJobs({
    q,
    industryId: ind?.split(","),
    specialityId: sp?.split(","),
    categoryId: ctg?.split(","),
    careerLevelId: clv?.split(","),
    employmentTypeId: emp?.split(","),
    workPlace: wp?.split(","),
    gender: gen?.split(","),
    educationLevel: edu?.split(","),
    countryCode: country?.split(","),
    stateCode: state?.split(","),
    salaryFrom: salaryFrom,
    salaryTo: salaryTo,
    ageFrom: ageFrom,
    ageTo: ageTo,
    page: parseInt(page || "1"),
    limit: parseInt(limit || "10"),
  });
  const { data: jobs, total } = result.data || { data: [], total: 0 };
  return (
    <main className="flex min-h-screen w-full flex-row px-2">
      <JobSearchFilter />
      <div className="w-full px-2 md:px-6 md:pl-9 lg:w-[80%]">
        <JobsResult jobs={jobs} total={total} />
        {total > 0 && total > jobs.length && (
          <CustomPagination totalItems={total} />
        )}
        <Suspense>
          <CountrySearchResult />
        </Suspense>
      </div>
    </main>
  );
};
const JobSearchFilter = async () => {
  const { data } = await getJobFilters();
  if (!data) return null;

  return <JobFilter data={data} />;
};

export default page;
