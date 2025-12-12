import { IconSkeleton } from "./loading";

const healthTips = [
  {
    name: "Healthy Eating",
    items: ["Eat balanced", "Limit processed foods"],
  },
  {
    name: "Exercise",
    items: [
      "30 min daily",
      "Strength train twice ",
      "Cardio 3-4 times a week",
      "Stretching twice a week",
    ],
  },
  {
    name: "Mental Health",
    items: ["Mindfulness daily", "7-9 hours sleep", "Reduce stress"],
  },
  {
    name: "Prevention",
    items: ["Regular check-ups", "Stay up-to-date", "Healthy lifestyle"],
  },
];



const FilterSkeleton = () => {
  return (
    <div className="hidden w-1/5 select-none rounded-[10px] border border-gray-100 bg-white p-[20px] text-transparent shadow-xl lg:block">
      <div className="space-y-6">
        {healthTips.map((section, index) => (
          <div key={index} className="border-b pb-4 last:border-b-0">
            <div className="mb-3 flex items-center justify-between">
              <div className="animate-pulse rounded bg-gray-300">
                {section.name}
              </div>
              <IconSkeleton />
            </div>

            <div className="px-1">
              <div className="grid grid-cols-1 gap-1 px-1">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="h-5 w-5 animate-pulse rounded-sm bg-gray-300"></div>
                    <div className="animate-pulse rounded bg-gray-300">
                      {item}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterSkeleton;
