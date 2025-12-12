import { searchCompanies } from "@/lib/actions/employer.actions";
import Slider from "./slide";

export default async function CompaniesSlider() {
  const result = await searchCompanies({
    page: 1,
    limit: 12,
    countryCode: "EG",
  });
  const data = result.data;
  const companies = data?.data || [];

  return (
    <Slider companies={companies} />
  );
}



