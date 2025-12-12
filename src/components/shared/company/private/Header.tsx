import { Typography } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PlaceIcon from "@mui/icons-material/Place";
import GroupsIcon from "@mui/icons-material/Groups";
import { Verified } from "@mui/icons-material";
import { Company } from "@/types";
import { companySizeList } from "@/constants";
import Cover from "./Cover";
import QuickEdit from "./QuickEdit";

interface CompanyPrivateHeaderProps {
  company: Company;
}

const Header: React.FC<CompanyPrivateHeaderProps> = ({ company }) => {
  const size = companySizeList.find((item) => item.value === company.size);
  return (
    <div className="overflow-hidden rounded-base border border-gray-200 bg-white shadow-soft">
      {/* Background Cover Image */}
      <Cover company={company} />
      {/* Profile Section */}
      <div className="rounded-base p-4">
        <div className="flex">
          {/* Text Section */}
          <div className="flex-1">
            <div className="text-left">
              <h3 className="mb-2 text-xl font-semibold text-main">
                {company.name}
                <Verified className="ml-3 text-primary" />
              </h3>
              {company.title && (
                <Typography
                  variant="body1"
                  sx={{ color: "#666", fontSize: { xs: "0.9rem", sm: "1rem" } }}
                >
                  {company.title}
                </Typography>
              )}
              <div className="mt-3 flex flex-wrap items-center justify-start">
                <div className="mr-3 flex items-center gap-1">
                  <LocalHospitalIcon className="text-primary" />
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {company.companyTypeName}
                  </Typography>
                </div>
                {(company.country?.name ||
                  company.state?.name ||
                  company.city) && (
                  <div className="mr-3 flex items-center gap-1">
                    <PlaceIcon className="text-primary" />
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {(company.country?.name || "") +
                        (company.state?.name ? `, ${company.state.name}` : "") +
                        (company.city ? `, ${company.city}` : "")}
                    </Typography>
                  </div>
                )}
                {size && (
                  <div className="mr-3 flex items-center gap-1">
                    <GroupsIcon className="text-primary" />
                    <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                      {size?.name}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Edit Profile Button */}
          <QuickEdit company={company} />
        </div>
      </div>
    </div>
  );
};

export default Header;
