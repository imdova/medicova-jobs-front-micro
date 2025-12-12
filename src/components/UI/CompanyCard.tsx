import Avatar from "@/components/UI/Avatar";
import { companySizeList } from "@/constants";
import { Company } from "@/types";
import { formatLocation } from "@/util/general";
import { LocationOn, MedicalServices } from "@mui/icons-material";
import Link from "next/link";

const CompanyCard: React.FC<{ company: Company }> = ({ company }) => {
  const size =
    companySizeList.find((item) => item.value === company?.size)?.name || "";
  const location = formatLocation(company);

  return (
    <div>
      <div className="flex h-full flex-col rounded-base border border-gray-300 p-4 shadow-soft">
        <div className="flex-1">
          {/* Header with Square Avatar */}
          <div className="flex items-center gap-2">
            <Avatar
              shape="square"
              src={company.avatar || ""}
              size={80}
              className="border-2 border-white"
            />
            <div>
              <h6 className="font-bold text-main">{company.name}</h6>
              <p className="text-secoundry text-sm">{size}</p>
              <p className="max-w-fit rounded-base bg-primary/10 p-2 text-xs text-primary">
                {10}
              </p>
            </div>
          </div>

          {/* Location and Type in One Row */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <LocationOn className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{location}</p>
            </div>
            <div className="flex items-center gap-1">
              <MedicalServices className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {company.companyTypeName}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="my-1 max-w-fit">
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {company.about}
            </p>
          </div>

          {/* View Full Profile Link */}
          <div className="mt-2 text-right">
            <Link
              href={`/co/${company.username}`}
              className="text-sm font-semibold text-primary underline hover:no-underline"
            >
              View full profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
