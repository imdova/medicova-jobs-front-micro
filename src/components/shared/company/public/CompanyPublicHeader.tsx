import { Typography } from "@mui/material";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import PlaceIcon from "@mui/icons-material/Place";
import GroupsIcon from "@mui/icons-material/Groups";
import { Verified } from "@mui/icons-material";
import { Company } from "@/types";
import { companySizeList, DEFAULT_COVER_IMAGE } from "@/constants";
import Avatar from "@/components/UI/Avatar";
import Image from "next/image";

interface CompanyPublicHeaderProps {
  company: Company;
}

const CompanyPublicHeader: React.FC<CompanyPublicHeaderProps> = ({
  company,
}) => {
  const size = companySizeList.find((item) => item.value === company.size);
  return (
    <div className="overflow-hidden rounded-base border border-gray-200 bg-white shadow-soft">
      {/* Background Cover Image */}
      <div className="grid grid-cols-1 grid-rows-1">
        {/* Avatar Positioned on Background Image */}
        <div
          // style={{ backgroundImage: `url(${company.cover})` }}
          className="col-start-1 row-start-1 min-h-24 w-full"
        >
          <Image
            src={company.cover || DEFAULT_COVER_IMAGE}
            width={1080}
            height={200}
            alt="cover Image"
            className="aspect-[4/1] min-h-24 w-full object-cover"
          />
        </div>
        <div className="col-start-1 row-start-1 h-fit w-fit self-end px-4 py-2">
          <Avatar
            src={company.avatar}
            alt={company.name}
            size={96}
            className="object-cover border-4 border-white shadow-soft"
          />
        </div>
      </div>
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
        </div>
      </div>
    </div>
  );
};

export default CompanyPublicHeader;
