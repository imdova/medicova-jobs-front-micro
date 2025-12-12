import Avatar from "@/components/UI/Avatar";
import { Company } from "@/types";
import { formatLocation, formatPrice } from "@/util/general";
import { LocationOnOutlined, MonetizationOn } from "@mui/icons-material";
import Link from "next/link";

// TODO : add skillton loading here
const CompanyMiniCard: React.FC<{ company: Company }> = ({ company }) => {
  const location = formatLocation(company);
  return (
    <Link
      href={`/co/${company.username}`}
      className="w-full cursor-pointer rounded-base border border-gray-200 p-3 transition-shadow hover:shadow-md"
    >
      <div className="flex gap-3">
        <Avatar
          shape="square"
          src={company.avatar || ""}
          alt={`${company.name} logo`}
          size={40}
          className="border-2 border-gray-200 bg-white"
          imageClass="object-contain p-1"
        />
        <div>
          <h6 className="line-clamp-1 font-semibold">{company.name}</h6>
          <p className="text-xs text-muted-foreground">
            {company.openJobs || 24} Open Jobs
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <p className="flex flex-nowrap items-center text-muted-foreground">
          <LocationOnOutlined className="mr-1 text-lg" />{" "}
          <span className="line-clamp-1 text-xs">{location}</span>
        </p>
        <p className="flex-nowrap text-nowrap text-xs text-muted-foreground">
          <MonetizationOn className="mr-1 text-lg" />
          {formatPrice(Number(company.revenue)) || formatPrice(105200)}
        </p>
      </div>
    </Link>
  );
};
export const CompanyMiniCardSkeleton: React.FC = () => {
  return (
    <div className="w-full cursor-pointer rounded-base border border-gray-200 p-3 transition-shadow hover:shadow-md">
      <div className="flex gap-3">
        <div className="h-[40px] w-[40px] border-2 border-gray-200 rounded-md bg-zinc-300 animate-pulse" />
        <div>
          <h6 className="line-clamp-1 mb-1 leading-tight animate-pulse rounded-md bg-zinc-300 font-semibold text-transparent">
            name
          </h6>
          <p className="animate-pulse rounded-md leading-tight bg-zinc-300 text-xs text-transparent">
            24 Open Jobs
          </p>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <p className="flex flex-nowrap items-center text-muted-foreground">
          <span className="p-[0.9px] line-clamp-1 animate-pulse rounded-md bg-zinc-300 text-xs text-transparent">
            location,location,
          </span>
        </p>
        <p className="animate-pulse flex-nowrap text-nowrap w-12 rounded-md bg-zinc-300 text-xs text-transparent">
          10k
        </p>
      </div>
    </div>
  );
};

export default CompanyMiniCard;
