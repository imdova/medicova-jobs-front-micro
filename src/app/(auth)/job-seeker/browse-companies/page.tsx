import CompanyCard from "@/components/UI/CompanyCard";
import CustomPagination from "@/components/UI/CustomPagination";
import { searchCompanies } from "@/lib/actions/employer.actions";

const BrowseCompaniesPage = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const { q, country, ctp, page, limit } = searchParams as {
    [key: string]: string;
  };
  const result = await searchCompanies({
    page: parseInt(page || "1"),
    limit: parseInt(limit || "12"),
    companyTypeId: ctp,
    countryCode: country || "EG",
    q: q || " ",
  });
  const data = result.data;
  const companies = data?.data || [];
  const total = data?.total || 0;
  return (
    <>
      <p className="text-muted-foreground">
        {/* TODO total */}
        Showing {total} results
      </p>

      {/* Companies List */}
      <div className="grid grid-cols-3 gap-3">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
      {/* Pagination */}
      <CustomPagination totalItems={total} initialNumberPerPage={12} />
    </>
  );
};

export default BrowseCompaniesPage;
