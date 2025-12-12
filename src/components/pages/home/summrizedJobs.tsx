"use client"
import { API_FILTER_SEARCH_JOBS, API_SEARCH_JOBS } from "@/api/employer";
import SectionTitle from "@/components/home/SectionTitle";
import MinJobCard from "@/components/UI/job-card-min";
import useFetch from "@/hooks/useFetch";
import { useJobFilters } from "@/hooks/useJobFilters";
import { JobData } from "@/types";
import { JobSearchFilter } from "@/types/jobs";
import { cn } from "@/util";
import { toQueryString } from "@/util/general";
import { Tab, Tabs } from "@mui/material";
import { useState } from "react";

type TabsType = "industryId" | "categoryId" | "countryCode";

interface TabOption {
    label: string;
    sectionKey: string;
    value: TabsType;
}
const tabs: TabOption[] = [
    { label: "Industry", sectionKey: "ind", value: "industryId" },
    { label: "Category  ", sectionKey: "ctg", value: "categoryId" },
    { label: "Country", sectionKey: "country", value: "countryCode" },
];
const SummarizedJobs = () => {
    const [filter, setFilter] = useState<JobSearchFilter>({
        page: 1,
        limit: 12,
    });
    const queryParams = toQueryString(filter);
    const { data: filterJobs } = useFetch<PaginatedResponse<JobData>>(
        API_SEARCH_JOBS + queryParams,
        {
            fetchOnce: false,
            fetchOnUrlChange: true,
        },
    );
    const { data: jobsFilter } = useFetch<JobsAggregations>(
        API_FILTER_SEARCH_JOBS,
    );

    const filters = useJobFilters(jobsFilter);
    const [activeTab, setActiveTab] = useState<TabOption | null>(tabs[0]);

    const filterItems =
        filters.find((x) => x.sectionKey === activeTab?.sectionKey)?.items || [];

    return <div className="container mx-auto p-2 pt-16 lg:max-w-[1170px]">
        <SectionTitle
            title={"Popular Jobs For"}
            featured={"Healthcare Providers"}
        />

        <div className="grid grid-cols-1">
            <div className="mb-4 border-b">
                <Tabs
                    value={activeTab?.value}
                    onChange={(e, value) => {
                        setActiveTab(tabs.find((x) => x.value === value) || null);
                        setFilter({
                            page: 1,
                            limit: 12,
                        });
                    }}
                    aria-label="basic tabs example"
                    variant="scrollable"
                    scrollButtons={false}
                    className="text-base"
                >
                    {tabs.map((tab) => (
                        <Tab
                            key={tab.value}
                            className="text-nowrap text-xs"
                            label={tab.label}
                            value={tab.value}
                        />
                    ))}
                </Tabs>
            </div>
        </div>
        {activeTab ? (
            <div className="flex flex-wrap gap-3">
                {filterItems
                    .filter((x) => x.count !== 0)
                    .map((item, index) => (
                        <button
                            className={cn(
                                "rounded-base bg-gray-200 px-4 py-2 hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                                String(filter[activeTab.value]) === item.value &&
                                "bg-primary text-white",
                            )}
                            onClick={() =>
                                setFilter((pv) => ({
                                    ...pv,
                                    [activeTab.value]: item.value,
                                }))
                            }
                            key={index}
                        >
                            {item.label} ({item.count})
                        </button>
                    ))}
            </div>
        ) : null}
        <div className="mt-4 grid h-fit grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {filterJobs?.data.map((job) => (
                <MinJobCard key={job.id} item={job} />
            ))}
        </div>
    </div>
}


export default SummarizedJobs;