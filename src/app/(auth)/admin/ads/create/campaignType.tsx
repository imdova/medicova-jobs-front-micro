import { AdType } from "@/constants/enums/adType.enum";
import { cn } from "@/util";
import Image from "next/image";

const options = [
  {
    image: "/images/ad-banner-0.png",
    name: AdType.HOME_PAGE_VERTICAL_BANNER_1,
  },
  {
    image: "/images/ad-banner-1.png",
    name: AdType.HOME_PAGE_VERTICAL_BANNER_2,
  },
  {
    image: "/images/ad-banner-2.png",
    name: AdType.HOME_PAGE_HORIZONTAL_BANNER_1,
  },
  {
    image: "/images/ad-banner-3.png",
    name: AdType.HOME_PAGE_HORIZONTAL_BANNER_2,
  },
];

const CampaignType: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  return (
    <div>
      <h5 className="mb-1 font-semibold">Campaign Placement</h5>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => onChange(option.name)}
            className={cn(
              "cursor-pointer overflow-hidden rounded-base border border-gray-200 bg-white shadow-soft duration-200 hover:shadow-xl",
              value === option.name &&
                "border-primary bg-primary/10 shadow-xl",
            )}
          >
            <Image
              src={option.image}
              alt={"Image: " + option.name}
              width={350}
              height={350}
            />
            <div className="p-2">
              <p>{option.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignType;
