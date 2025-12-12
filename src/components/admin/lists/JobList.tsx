"use client";

import { TAGS } from "@/api";
import {
  API_GET_JOBS,
  API_GET_JOBS_BY_COMPANY_ID,
  API_UPDATE_JOB,
} from "@/api/employer";
import { CheckboxField } from "@/components/form/FormModal/fields/CheckboxField";
import { FormField } from "@/components/form/FormModal/fields/FormField";
import Avatar from "@/components/UI/Avatar";
import DataTable from "@/components/UI/data-table";
import DeleteConfirmationDialog from "@/components/UI/DeleteConfirmationDialog";
import FilterDrawer from "@/components/UI/FilterDrawer";
import { employerFilters } from "@/constants";
import { Gender } from "@/constants/enums/gender.enum";
import useFetch from "@/hooks/useFetch";
import { useIndustriesData } from "@/hooks/useIndustriesData";
import { useLocationData } from "@/hooks/useLocationData";
import { useSectorsData } from "@/hooks/useSectorsData";
import useUpdateApi from "@/hooks/useUpdateApi";
import {
  ColumnConfig,
  Country,
  FieldConfig,
  Industry,
  JobData,
  Option,
  Sector,
} from "@/types";
import { updateItemInArray } from "@/util/general";
import { Female, Male } from "@mui/icons-material";
import {
  TextField,
  IconButton,
  Tabs,
  Tab,
  Tooltip,
  ListItemIcon,
} from "@mui/material";
import {
  CheckCircle,
  Copy,
  Eye,
  Filter,
  Search,
  SquarePen,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface JobFilter {
  country: string;
  industry: string;
  category: string;
  employer: string;
  status: string;
  date: string;
}

const tabs: Option[] = [
  { label: "All Jobs", value: "all" },
  { label: "Active Jobs", value: "active" },
  { label: "Inactive Jobs", value: "inactive" },
  // { label: "Pending Jobs", value: "pending" },
];

const baseFilters = {
  country: "",
  industry: "",
  category: "",
  employer: "",
  status: "",
  date: "",
};

const genderIcons: Record<keyof typeof Gender, React.ReactNode> = {
  MALE: (
    <Male className="h-7 w-7 text-blue-500 group-aria-selected:text-white" />
  ),
  FEMALE: (
    <Female className="h-7 w-7 text-pink-500 group-aria-selected:text-white" />
  ),
  ANY: null,
};

const JobList: React.FC<{ companyId?: string; isAdmin?: boolean }> = ({
  companyId,
  isAdmin = false,
}) => {
  const { countries } = useLocationData();
  const { industries } = useIndustriesData();
  const { types } = useSectorsData();

  const [activeTab, setActiveTab] = useState<Option | null>(tabs[0]);
  const [selectedItems, setSelectedItems] = useState<(number | string)[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<JobFilter>(baseFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [jobToDelete, setJopToDelete] = useState<JobData | null>(null);

  // Featured jobs list (placeholder - in real app this would come from API)
  const [featuredJobIds, setFeaturedJobIds] = useState<(string | number)[]>([]);

  // Fetch data
  const { data: jobs, setData } = useFetch<PaginatedResponse<JobData>>(
    companyId ? API_GET_JOBS_BY_COMPANY_ID + companyId : API_GET_JOBS,
  );

  const handleClose = () => {
    setJopToDelete(null);
  };

  const handleDelete = async () => {
    if (jobToDelete?.id) {
      console.log("🚀 ~ handleDelete ~ jobToDelete:", jobToDelete);
      // update(API_DELETE_JOB + jobToDelete?.id, { method: "DELETE" }, TAGS.jobs);
    }
    setJopToDelete(null);
  };

  // Admin-only function to add job to featured list
  const handleAddToFeatured = async (jobId: string | number) => {
    console.log("Adding job to featured list:", jobId);
    // TODO: Implement API call to add job to featured list
    // await update(API_ADD_TO_FEATURED, { body: { jobId } }, TAGS.jobs, "Featured Job");

    // For now, just update the local state
    setFeaturedJobIds((prev) => [...prev, jobId]);
  };

  // Admin-only function to remove job from featured list
  const handleRemoveFromFeatured = async (jobId: string | number) => {
    console.log("Removing job from featured list:", jobId);
    // TODO: Implement API call to remove job from featured list
    // await update(API_REMOVE_FROM_FEATURED, { body: { jobId } }, TAGS.jobs, "Featured Job");

    // For now, just update the local state
    setFeaturedJobIds((prev) => prev.filter((id) => id !== jobId));
  };

  // Helper function to check if a job is featured
  const isJobFeatured = (jobId: string | number) => {
    return featuredJobIds.includes(jobId);
  };

  const fields = getFelids({
    countries,
    companyTypes: types.data.data,
    industries: industries.data.data,
  });

  const { update } = useUpdateApi<JobData>();

  const handleAction = async ({
    type,
    data,
  }: {
    type: string;
    data: JobData;
  }) => {
    if (type === "update") {
      const updatedJob = await update(
        API_UPDATE_JOB,
        { body: data },
        TAGS.jobs,
        {
          error: {
            title: "Failed to update job",
            description: "Please try again.",
          },
          success: {
            title: "Job Updated Successfully",
            description: "Your job has been updated successfully.",
          },
        },
      );
      if (updatedJob) {
        const newCompanies = updateItemInArray(jobs?.data || [], updatedJob);
        setData?.({
          data: newCompanies,
          total: jobs?.total || newCompanies.length,
          limit: jobs?.limit || 10,
          page: jobs?.page || 1,
        });
      }
    }
  };

  const cols = getCols(
    handleAction,
    isAdmin,
    isJobFeatured,
    Boolean(companyId),
  );

  // Filter jobs based on active tab
  const getFilteredJobs = () => {
    if (!jobs?.data) return [];

    switch (activeTab?.value) {
      case "active":
        return jobs.data.filter((job) => job.active);
      case "inactive":
        return jobs.data.filter((job) => !job.active);
      case "approved":
        return jobs.data.filter((job) => job.active);
      case "disapproved":
        return jobs.data.filter((job) => !job.active);
      case "featured":
        return jobs.data.filter((job) => isJobFeatured(job.id));
      case "pending":
        return jobs.data.filter((job) => job.draft);
      default:
        return jobs.data;
    }
  };

  const filteredJobs = getFilteredJobs();

  const adminBulkActions = isAdmin
    ? [
        {
          label: (items?: JobData[]) => (
            <button
              onClick={() =>
                handleAction({
                  type: "update",
                  data: {
                    id: items?.[0]?.id,
                    active: !items?.[0]?.active,
                  } as JobData,
                })
              }
              className="w-full text-left"
            >
              <ListItemIcon>
                <ThumbsUp
                  className={`h-4 w-4 ${items?.[0]?.active ? "text-red-500" : "text-green-500"}`}
                />
              </ListItemIcon>
              <span
                className={
                  items?.[0]?.active ? "text-red-500" : "text-green-500"
                }
              >
                {items?.[0]?.active ? "Disapprove" : "Approve"}
              </span>
            </button>
          ),
        },
        {
          label: (items?: JobData[]) => (
            <button
              onClick={() =>
                isJobFeatured(items?.[0]?.id || "")
                  ? handleRemoveFromFeatured(items?.[0]?.id || "")
                  : handleAddToFeatured(items?.[0]?.id || "")
              }
              className="w-full text-left"
            >
              <ListItemIcon>
                <ThumbsUp
                  className={`h-4 w-4 ${isJobFeatured(items?.[0]?.id || "") ? "text-red-500" : "text-green-500"}`}
                />
              </ListItemIcon>
              <span
                className={
                  isJobFeatured(items?.[0]?.id || "")
                    ? "text-red-500"
                    : "text-green-500"
                }
              >
                {isJobFeatured(items?.[0]?.id || "")
                  ? "Remove from Featured"
                  : "Add to Featured"}
              </span>
            </button>
          ),
        },
      ]
    : [];

  const adminOptions = isAdmin
    ? [
        {
          label: (item?: JobData) => (
            <button
              onClick={() =>
                handleAction({
                  type: "update",
                  data: {
                    id: item?.id,
                    active: !item?.active,
                  } as JobData,
                })
              }
              className="w-full text-left"
            >
              <ListItemIcon>
                <ThumbsUp
                  className={`h-4 w-4 ${item?.active ? "text-red-500" : "text-green-500"}`}
                />
              </ListItemIcon>
              <span
                className={item?.active ? "text-red-500" : "text-green-500"}
              >
                {item?.active ? "Disapprove" : "Approve"}
              </span>
            </button>
          ),
        },
        {
          label: (item?: JobData) => (
            <button
              onClick={() =>
                isJobFeatured(item?.id || "")
                  ? handleRemoveFromFeatured(item?.id || "")
                  : handleAddToFeatured(item?.id || "")
              }
              className="w-full text-left"
            >
              <ListItemIcon>
                <ThumbsUp
                  className={`h-4 w-4 ${isJobFeatured(item?.id || "") ? "text-red-500" : "text-green-500"}`}
                />
              </ListItemIcon>
              <span
                className={
                  isJobFeatured(item?.id || "")
                    ? "text-red-500"
                    : "text-green-500"
                }
              >
                {isJobFeatured(item?.id || "")
                  ? "Remove from Featured"
                  : "Add to Featured"}
              </span>
            </button>
          ),
        },
      ]
    : [];

  const adminTabs = isAdmin
    ? [
        { label: "Approved Jobs", value: "approved" },
        { label: "Disapproved Jobs", value: "disapproved" },
        { label: "Featured Jobs", value: "featured" },
      ]
    : [];

  const allTabs = [...tabs, ...adminTabs];

  return (
    <>
      <DeleteConfirmationDialog
        open={Boolean(jobToDelete)}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this Job? This action cannot be undone.`}
        onDelete={handleDelete}
        onClose={handleClose}
      />
      <div className="grid grid-cols-1 space-y-1 rounded-base border border-gray-200 bg-white shadow-soft">
        <div className="border-b border-gray-200">
          <div>
            <div>
              <div className="flex flex-col justify-between gap-3 md:flex-row">
                <h5 className="w-full p-3 pb-1 text-xl font-semibold text-main">
                  {activeTab?.label}
                  <span className="ml-1 text-sm text-muted-foreground">
                    ({filteredJobs.length})
                  </span>
                </h5>
                <div className="flex w-full flex-col items-end gap-2 p-2 sm:flex-row">
                  <TextField
                    className="w-full"
                    variant="outlined"
                    placeholder="Search For Jobs"
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
                    value={activeTab?.value}
                    onChange={(e, value) =>
                      setActiveTab(
                        allTabs.find((x) => x.value === value) || null,
                      )
                    }
                    aria-label="basic tabs example"
                    variant="scrollable"
                    scrollButtons={false}
                    className="text-base"
                  >
                    {allTabs.map((tab) => (
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
        <div className="flex flex-wrap gap-2 overflow-hidden overflow-x-auto border-b border-gray-200 p-3 md:flex-nowrap">
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
        </div>
        <DataTable<JobData>
          data={filteredJobs}
          total={filteredJobs.length}
          selected={selectedItems}
          setSelected={setSelectedItems}
          isSelectable
          cellClassName="p-2 text-sm"
          headerClassName="p-2 text-sm"
          tableHeaderClass="border-b  border-gray-200 p-3"
          className="border-none"
          searchQuery={searchQuery}
          columns={cols}
          columnManager={true}
          defaultVisibleColumns={[
            "Company",
            "Job Title",
            "Date",
            "Country",
            "Category",
            "Applicants",
            "Status",
            "Approval Status",
            "Featured",
          ]}
          exportOptions={[
            { label: "PDF", action: () => console.log("Exporting") },
            { label: "CSV", action: () => console.log("Exporting") },
          ]}
          options={[
            {
              label: (item?: JobData) => (
                <Link href={`/job/${item?.id}`} className="w-full">
                  <ListItemIcon>
                    <Eye className="h-4 w-4" />
                  </ListItemIcon>
                  View Job Details
                </Link>
              ),
            },
            {
              label: (item?: JobData) => (
                <Link
                  href={
                    isAdmin
                      ? `/admin/jobs/${item?.id}`
                      : `/employer/job/over-view/${item?.id}`
                  }
                  className="w-full"
                >
                  <ListItemIcon>
                    <Eye className="h-4 w-4" />
                  </ListItemIcon>
                  Job Overview
                </Link>
              ),
            },
            {
              label: (item?: JobData) => (
                <Link
                  href={`/employer/job/posted/${item?.id}`}
                  className="w-full"
                >
                  <ListItemIcon>
                    <SquarePen className="h-4 w-4" />
                  </ListItemIcon>
                  Edit
                </Link>
              ),
            },
            {
              label: (item?: JobData) => (
                <Link
                  href={`/employer/job/posted/${item?.id}?duplicate=true`}
                  className="w-full"
                >
                  <ListItemIcon>
                    <Copy className="h-4 w-4" />
                  </ListItemIcon>
                  Duplicate
                </Link>
              ),
            },
            {
              label: (item?: JobData) => (
                <button
                  onClick={() =>
                    handleAction({
                      type: "update",
                      data: {
                        id: item?.id,
                        active: !item?.active,
                      } as JobData,
                    })
                  }
                  className="w-full text-left"
                >
                  <ListItemIcon>
                    <CheckCircle
                      className={`h-4 w-4 ${item?.active ? "text-orange-500" : "text-green-500"}`}
                    />
                  </ListItemIcon>
                  <span
                    className={
                      item?.active ? "text-orange-500" : "text-green-500"
                    }
                  >
                    {item?.active ? "Deactivate" : "Activate"}
                  </span>
                </button>
              ),
            },
            ...adminOptions,
            {
              label: <span className="text-red-500">Delete</span>,
              action: (job) => setJopToDelete(job || null),
              icon: <Trash2 size={15} className="text-red-500" />,
            },
          ]}
          actionOptions={[
            {
              label: (items) => (
                <button
                  onClick={() =>
                    handleAction({
                      type: "update",
                      data: {
                        id: items?.[0]?.id,
                        active: !items?.[0]?.active,
                      } as JobData,
                    })
                  }
                  className="w-full text-left"
                >
                  <ListItemIcon>
                    <CheckCircle
                      className={`h-4 w-4 ${items?.[0]?.active ? "text-orange-500" : "text-green-500"}`}
                    />
                  </ListItemIcon>
                  <span
                    className={
                      items?.[0]?.active ? "text-orange-500" : "text-green-500"
                    }
                  >
                    {items?.[0]?.active ? "Deactivate" : "Activate"}
                  </span>
                </button>
              ),
            },

            ...adminBulkActions,
          ]}
        />
      </div>
    </>
  );
};

const getCols = (
  action?: ({ type, data }: { type: string; data: JobData }) => void,
  isAdmin: boolean = false,
  isJobFeatured?: (jobId: string | number) => boolean,
  isCompany: boolean = false,
): ColumnConfig<JobData>[] => {
  const baseCols = getBaseColumns(action, isAdmin);
  const adminCols = isAdmin ? getAdminColumns(isJobFeatured) : [];
  const companyCol = isCompany
    ? []
    : ([
        {
          key: "company.name",
          sortable: true,
          header: "Company",
          render: (item: JobData) => (
            <div className="flex items-center gap-2">
              <Avatar src={item.company?.avatar} />
              <div>
                <Tooltip title={item.company?.name}>
                  <Link
                    className="transition hover:text-primary"
                    href={`/admin/employers/${item.company?.username}`}
                  >
                    <h6 className="line-clamp-1 text-sm">
                      {item.company?.name}
                    </h6>
                  </Link>
                </Tooltip>
              </div>
            </div>
          ),
        },
      ] as ColumnConfig<JobData>[]);
  return [...companyCol, ...baseCols, ...adminCols];
};

const getBaseColumns = (
  action?: ({ type, data }: { type: string; data: JobData }) => void,
  isAdmin: boolean = false,
): ColumnConfig<JobData>[] => [
  {
    key: "title",
    sortable: true,
    header: "Job Title",
    render: (job: JobData) => (
      <Link
        className="line-clamp-2 min-w-44 text-sm transition hover:text-primary hover:underline"
        href={
          isAdmin
            ? `/admin/jobs/${job?.id}`
            : `/employer/job/over-view/${job?.id}`
        }
      >
        {job.title || "-"}
      </Link>
    ),
  },
  {
    key: "created_at",
    sortable: true,
    header: "Date",
    render: (job: JobData) => {
      const formattedDate = new Date(job.created_at).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        },
      );

      return (
        <span className="line-clamp-1 min-w-40 text-sm">
          {formattedDate || "-"}
        </span>
      );
    },
  },
  {
    key: "country",
    sortable: true,
    header: "Country",
    render: (job: JobData) => {
      return <span className="text-sm">{job.country?.name || "-"}</span>;
    },
  },
  {
    key: "state",
    sortable: true,
    header: "State",
    render: (job: JobData) => {
      return <span className="text-sm">{job.state?.name || "-"}</span>;
    },
  },
  {
    key: "city",
    sortable: true,
    header: "City",
    render: (job: JobData) => {
      return <span className="text-sm">{job.city || "-"}</span>;
    },
  },
  {
    key: "jobIndustry",
    sortable: true,
    header: "Industry",
    render: (job: JobData) => (
      <span className="text-sm">{job.jobIndustry || "-"}</span>
    ),
  },
  {
    key: "jobSpeciality",
    sortable: true,
    header: "Speciality",
    render: (job: JobData) => (
      <span className="text-sm">{job.jobSpeciality || "-"}</span>
    ),
  },
  {
    key: "jobCategory",
    sortable: true,
    header: "Category",
    render: (job: JobData) => (
      <span className="text-sm">{job.jobCategory || "-"}</span>
    ),
  },
  {
    key: "jobCareerLevel",
    sortable: true,
    header: "Career Level",
    render: (job: JobData) => (
      <span className="text-sm">{job.jobCareerLevel || "-"}</span>
    ),
  },
  {
    key: "jobEmploymentType",
    sortable: true,
    header: "Employment Type",
    render: (job: JobData) => (
      <span className="text-sm">{job.jobEmploymentType || "-"}</span>
    ),
  },
  {
    key: "jobWorkPlace",
    sortable: true,
    header: "Work Place",
    render: (job: JobData) => (
      <span className="text-sm">{job.jobWorkPlace || "-"}</span>
    ),
  },
  {
    key: "educationLevel",
    sortable: true,
    header: "Education",
    render: (job: JobData) => (
      <span className="text-sm">{job.educationLevel || "-"}</span>
    ),
  },
  {
    key: "minExpYears",
    sortable: true,
    header: "Experience",
    render: (job: JobData) => (
      <span className="text-sm">
        {job.minExpYears && job.maxExpYears
          ? `${job.minExpYears}-${job.maxExpYears} years`
          : "-"}
      </span>
    ),
  },
  {
    key: "salaryRangeStart",
    sortable: true,
    header: "Salary",
    render: (job: JobData) => (
      <span className="text-sm">
        {job.hideSalary
          ? "Hidden"
          : job.salaryRangeStart && job.salaryRangeEnd
            ? `${job.salaryRangeStart}-${job.salaryRangeEnd} ${job.salaryCurrency}`
            : "-"}
      </span>
    ),
  },
  {
    key: "availableVacancies",
    sortable: true,
    header: "Vacancies",
    render: (job: JobData) => (
      <span className="text-sm">{job.availableVacancies || "-"}</span>
    ),
  },
  {
    key: "applicationCount",
    sortable: true,
    header: "Applicants",
    render: (job: JobData) => (
      <span className="text-sm">{job.applicationCount || "-"}</span>
    ),
  },
  {
    key: "gender",
    sortable: true,
    header: "Gender",
    render: (job: JobData) => (
      <span className="flex items-center gap-1 text-sm">
        {job.gender ? (
          <>
            {genderIcons[job.gender]}
            {job.gender}
          </>
        ) : (
          "-"
        )}
      </span>
    ),
  },
  {
    key: "minAge",
    sortable: true,
    header: "Age Range",
    render: (job: JobData) => (
      <span className="text-sm">
        {job.minAge && job.maxAge ? `${job.minAge}-${job.maxAge} years` : "-"}
      </span>
    ),
  },
  {
    key: "startDateType",
    sortable: true,
    header: "Start Date Type",
    render: (job: JobData) => (
      <span className="text-sm">{job.startDateType || "-"}</span>
    ),
  },
  {
    key: "active",
    sortable: true,
    header: "Status",
    render: (item: JobData) => (
      <CheckboxField
        field={{
          name: "status",
          type: "checkbox",
        }}
        controllerField={{
          value: item.active,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            action?.({
              type: "update",
              data: {
                id: item.id,
                active: e.target.checked,
              } as JobData,
            }),
        }}
      />
    ),
  },
];
const getAdminColumns = (
  isJobFeatured?: (jobId: string | number) => boolean,
): ColumnConfig<JobData>[] => [
  {
    key: "active",
    sortable: true,
    header: "Approval Status",
    render: (item: JobData) => (
      <span
        className={`text-sm font-medium ${item.active ? "text-green-600" : "text-red-600"}`}
      >
        {item.active ? "Approved" : "Disapproved"}
      </span>
    ),
  },
  {
    key: "active",
    sortable: true,
    header: "Featured",
    render: (item: JobData) => (
      <span
        className={`text-sm font-medium ${isJobFeatured?.(item.id) ? "text-blue-600" : "text-gray-500"}`}
      >
        {isJobFeatured?.(item.id) ? "Featured" : "Not Featured"}
      </span>
    ),
  },
];

const getFelids = ({
  countries,
  industries,
  companyTypes,
}: {
  countries: Country[];
  industries: Industry[];
  companyTypes: Sector[];
}): FieldConfig[] => [
  {
    name: "country",
    type: "search-select",
    textFieldProps: {
      placeholder: "Country",
    },
    options:
      countries?.map((country) => ({
        value: country.isoCode,
        label: country.name,
      })) || [],
  },
  {
    name: "industry",
    type: "select",
    textFieldProps: {
      placeholder: "Industry",
    },
    options:
      industries.map((sector) => ({
        value: sector.id,
        label: sector.name,
      })) || [],
    gridProps: { xs: 6 },
  },
  {
    name: "category",
    type: "select",
    textFieldProps: {
      placeholder: "Company Type",
    },
    dependsOn: "industry",
    options:
      companyTypes.map((type) => ({
        value: type.id,
        label: type.name,
      })) || [],
    gridProps: { xs: 6 },
  },
  {
    name: "status",
    type: "select",
    textFieldProps: {
      placeholder: "Status",
    },
    options: [
      { value: "active", label: "Active" },
      { value: "inActive", label: "Inactive" },
    ],
  },
  {
    name: "date",
    type: "date",
    textFieldProps: {
      placeholder: "Date",
    },
  },
];
export default JobList;
