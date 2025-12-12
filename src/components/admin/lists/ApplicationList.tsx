"use client";

import { API_GET_JOB_APPLICATIONS } from "@/api/employer";
import ApplicationBadge from "@/components/UI/ApplicationBadge";
import Avatar from "@/components/UI/Avatar";
import DataTable from "@/components/UI/data-table";
import { ApplicationStatus } from "@/constants/enums/application-status.enum";
import useFetch from "@/hooks/useFetch";
import { ColumnConfig, Option } from "@/types";
import { ApplicationsType } from "@/types/seeker";
import { toQueryString } from "@/util/general";
import { KeyboardReturn } from "@mui/icons-material";
import { TextField, Tabs, Tab } from "@mui/material";
import { CheckCircle, Eye, Search, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const tabs: Option[] = [
  {
    value: ApplicationStatus.REVIEW,
    label: "Review",
    icon: <Eye className="h-4 w-4 text-blue-500" />,
  },
  {
    value: ApplicationStatus.VIEWED,
    label: "Viewed",
    icon: <CheckCircle className="h-4 w-4 text-indigo-500" />,
  },
  {
    value: ApplicationStatus.SHORTLISTED,
    label: "Shortlisted",
    icon: <Star className="h-4 w-4 text-yellow-500" />,
  },
  {
    value: ApplicationStatus.WITHDRAWN,
    label: "Withdrawn",
    icon: <KeyboardReturn className="h-4 w-4 text-amber-600" />,
  },
];

const ApplicationList: React.FC<{
  seekerId?: string;
  companyId?: string;
  jobId?: string;
}> = ({ seekerId, companyId, jobId }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [selectedItems, setSelectedItems] = useState<(number | string)[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const query = toQueryString({ seekerId, companyId, jobId });
  const { data: applications, loading } = useFetch<
    PaginatedResponse<ApplicationsType>
  >(query ? API_GET_JOB_APPLICATIONS + query : API_GET_JOB_APPLICATIONS);

  const handleAction = ({
    type,
    data,
  }: {
    type: string;
    data: ApplicationsType;
  }) => {
    if (type === "update") {
      // updateCompany(data);
    }
  };

  const columns = getCols(handleAction);

  return (
    <div className="grid grid-cols-1 space-y-1 rounded-base border border-gray-200 bg-white shadow-soft">
      <div className="border-b border-gray-200">
        <div>
          <div>
            <div className="flex flex-col justify-between gap-3 md:flex-row">
              <h5 className="w-full p-3 pb-1 text-xl font-semibold text-main">
                All Applications
                <span className="ml-1 text-xs text-muted-foreground">
                  ({applications?.total})
                </span>
              </h5>
              <div className="flex w-full flex-col items-end gap-2 p-2 sm:flex-row">
                <TextField
                  className="w-full"
                  variant="outlined"
                  placeholder="Search For Application"
                  value={searchQuery}
                  InputProps={{
                    startAdornment: <Search />,
                  }}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1">
              <div>
                <Tabs
                  value={activeTab}
                  onChange={(e, value) => setActiveTab(value)}
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
          </div>
        </div>
      </div>
      {/* <div className="flex flex-wrap gap-2 overflow-hidden overflow-x-auto border-b border-gray-200 p-3 md:flex-nowrap">
        {fields.map((field) => (
          <div className="flex-1" key={field.name}>
            <FormField field={field} data={filters} setData={setFilters} />
          </div>
        ))}
        <IconButton
          onClick={() => setIsFilterOpen(true)}
          className="w-12 rounded-base border border-solid border-zinc-400"
        >
          <Filter className="h-4 w-4" />
        </IconButton>
        <FilterDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          sections={employerFilters}
        />
      </div> */}
      <DataTable<ApplicationsType>
        data={applications?.data || []}
        total={applications?.total}
        selected={selectedItems}
        setSelected={setSelectedItems}
        isSelectable
        cellClassName="p-2 text-sm"
        headerClassName="p-2 text-sm"
        tableHeaderClass="border-b  border-gray-200 p-3"
        className="border-none"
        columns={columns}
        searchQuery={searchQuery}
        columnManager={true}
        exportOptions={[
          { label: "PDF", action: () => console.log("Exporting") },
          { label: "CSV", action: () => console.log("Exporting") },
        ]}
        options={[
          {
            label: "View Profile",
            action: () => console.log("viewed profile"),
            icon: <Eye size={15} />,
          },
        ]}
        actionOptions={[
          {
            label: "View Profile",
            action: () => console.log("viewed profile"),
            icon: <Eye size={15} />,
          },
        ]}
        noDataMessage={{
          title: "No applications found",
          description: "Try adjusting your search or filter criteria",
          action: {
            label: "View All Applications",
            href: "/admin/applications",
          },
        }}
      />
    </div>
  );
};

const getCols = (
  action?: ({ type, data }: { type: string; data: ApplicationsType }) => void,
): ColumnConfig<ApplicationsType>[] => [
  {
    header: "Company",
    render: (app: ApplicationsType) => (
      <div className="flex items-center gap-2">
        <Avatar
          src={app.job.company.avatar}
          size={30}
          alt={app.job.company.name}
        />
        <Link
          className="line-clamp-2 text-sm transition hover:text-primary hover:underline"
          href={`/admin/employers/${app.job.company.username}`}
        >
          {app.job.company.name || "-"}
        </Link>
      </div>
    ),
  },
  {
    header: "Job Title",
    render: (app: ApplicationsType) => (
      <Link
        className="line-clamp-2 text-sm transition hover:text-primary hover:underline"
        href={`/admin/jobs/${app.job.id}`}
      >
        {app.job.title || "-"}
      </Link>
    ),
  },
  {
    header: "Seeker",
    render: (app: ApplicationsType) => (
      <div className="flex items-center gap-2">
        <Avatar
          src={app.applicant.avatar}
          size={30}
          alt={app.applicant.firstName}
        />
        <div className="flex flex-col">
          <Link
            className="text-sm transition hover:text-primary hover:underline"
            href={`/admin/seekers/${app.applicant.userName}`}
          >
            {`${app.applicant.firstName} ${app.applicant.lastName} ` || "-"}
          </Link>
          <Link
            className="text-xs text-primary transition"
            href={`mailto:${app.applicant.userName}`}
          >
            {app.applicant.email || "-"}
          </Link>
        </div>
      </div>
    ),
  },
  {
    key: "created_at",
    header: "Date",
    render: (app: ApplicationsType) => {
      const formattedDate = new Date(app.created_at).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
      );

      return (
        <span className="text-nowrap text-sm">{formattedDate || "-"}</span>
      );
    },
  },
  // {
  //   key: "updated_at",
  //   header: "Updated",
  //   render: (app: ApplicationsType) => {
  //     const formattedDate = new Date(app.updated_at).toLocaleDateString(
  //       "en-US",
  //       {
  //         year: "numeric",
  //         month: "short",
  //         day: "numeric",
  //       },
  //     );

  //     return <span className="text-sm">{formattedDate || "-"}</span>;
  //   },
  // },
  {
    key: "status",
    header: "Status",
    render: (app) => <ApplicationBadge status={app.status} />,
  },
];

export default ApplicationList;
