"use client";
import { Drawer, IconButton } from "@mui/material";
import { Suspense } from "react";
import FilterItem from "./FilterItem";
import { Close } from "@mui/icons-material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createUrl } from "@/util";

const FilterDrawerComponent: React.FC<FilterDrawerProps> = ({
  sections,
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleCheckChange = (params: FilterParam[]) => {
    const newParams = new URLSearchParams(searchParams.toString());
    params.forEach(({ sectionKey, value }) => {
      newParams.set(sectionKey, value.join(","));
    });
    router.push(createUrl(pathname, newParams), { scroll: false });
  };

  const getSelectedFilters = () => {
    const selected: Record<string, string[]> = {};

    sections.forEach((section) => {
      const param = searchParams.get(section.sectionKey);
      const values = param?.split(",").filter(Boolean) || [];
      if (values.length > 0) {
        selected[section.sectionKey] = values;
      } else {
        selected[section.sectionKey] = [];
      }
    });

    return selected;
  };

  const selectedFilters = getSelectedFilters();

  return (
    <Drawer
      anchor="left"
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          // borderTopLeftRadius: "16px",
          // borderTopRightRadius: "16px",
          // padding: "1rem",
          maxHeight: "100dvh",
          minWidth:"250px"
        },
      }}
    >
      <div className="sticky top-0 z-[2] bg-white p-4">
        <div className="flex items-center justify-between bg-[#DEF0EB] px-4 py-2">
          <h5 className="text-3xl font-bold">Filters</h5>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </div>
      </div>
      <div className="space-y-6 p-6">
        {sections.map((section, index) => (
          <FilterItem
            key={section.sectionKey}
            {...section}
            index={index}
            value={selectedFilters[section.sectionKey] || []}
            handleCheckChange={handleCheckChange}
          />
        ))}
      </div>
    </Drawer>
  );
};

const FilterDrawer: React.FC<FilterDrawerProps> = (props) => {
  return (
    <Suspense>
      <FilterDrawerComponent {...props} />
    </Suspense>
  );
};

export default FilterDrawer;
