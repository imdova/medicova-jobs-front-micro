import { getCompanyByUserName } from "@/lib/actions/employer.actions";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import CompanyPublicPage from "@/components/shared/company/public/CompanyPublicPage";
import CompanyPrivatePage from "@/components/shared/company/private/CompanyPrivatePage";

const Page = async ({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const isPublic = searchParams?.public;
  const data = await getServerSession(authOptions);
  const user = data?.user;

  const { success, data: company } = await getCompanyByUserName(id);

  if (!success || !company) return notFound();

  let isEmployee = company.id === user?.companyId || user?.type === "admin";
  isEmployee = isPublic ? false : isEmployee;

  return isEmployee ? (
    <CompanyPrivatePage companyId={company.id} />
  ) : (
    <CompanyPublicPage company={company} />
  );
};

export default Page;
