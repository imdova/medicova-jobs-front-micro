import { IconButton, Tab, Tabs, TextField, Tooltip } from "@mui/material";
import {
  Download,
  Female,
  LinkOutlined,
  Male,
  Search,
} from "@mui/icons-material";
import { useState } from "react";
import DataTable from "@/components/UI/data-table";
import { ColumnConfig, FieldConfig, SearchSeekerFilter } from "@/types";
import Avatar from "@/components/UI/Avatar";
import Link from "next/link";
import { formatDate, formatName } from "@/util";
import { useLocationData } from "@/hooks/useLocationData";
import { FormField } from "@/components/form/FormModal/fields/FormField";
import { API_GET_SEEKERS, API_UPDATE_SEEKER } from "@/api/seeker";
import useUpdateApi from "@/hooks/useUpdateApi";
import { TAGS } from "@/api";
import {
  Eye,
  Filter,
  Edit,
  Trash,
  MessageSquare,
  Mail,
  User,
} from "lucide-react";
import {
  formatLocation,
  getExperienceDetail,
  updateItemInArray,
} from "@/util/general";
import { SeekerSearchFilter } from "@/types/jobs";
import FilterDrawer from "@/components/UI/FilterDrawer";
import { searchFilters } from "@/constants";
import { useSearchParams } from "next/navigation";
import { EducationLevel } from "@/constants/enums/education-level.enum";
import { Gender } from "@/constants/enums/gender.enum";
import { socialMediaIcons } from "@/components/shared/SocialMediaSection";
import { CheckboxField } from "@/components/form/FormModal/fields/CheckboxField";
import { useIndustriesData } from "@/hooks/useIndustriesData";
import useFetch from "@/hooks/useFetch";
import { SocialMediaLinks, UserProfile } from "@/types/seeker";

const genderIcons: Record<keyof typeof Gender, React.ReactNode> = {
  MALE: (
    <Male className="h-7 w-7 text-blue-500 group-aria-selected:text-white" />
  ),
  FEMALE: (
    <Female className="h-7 w-7 text-pink-500 group-aria-selected:text-white" />
  ),
  ANY: null,
};

const tabs = [
  "All Seekers",
  "New Seekers",
  "Active Seekers",
  "Inactive Seekers",
] as const;

type TabValue = (typeof tabs)[number];

type FilterType = SearchSeekerFilter & {
  sector?: string;
  date?: string;
};

interface ApiFilters extends SeekerSearchFilter {
  page: number;
  limit: number;
  q: string;
  active?: boolean;
}

const filterBase = {
  q: "",
  countryCode: [],
  educationLevel: [],
  specialityIds: [],
  categoryIds: [],
};

const SeekersTable: React.FC = () => {
  const { data: seekersData, setData } =
    useFetch<PaginatedResponse<UserProfile>>(API_GET_SEEKERS);
  const { isLoading, error, update } = useUpdateApi<UserProfile>();
  const { countries } = useLocationData();
  const searchParams = useSearchParams();
  const { categories, specialities } = useIndustriesData();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selected, setSelected] = useState<(number | string)[]>([]);
  const [activeTab, setActiveTab] = useState<TabValue>("All Seekers");
  const [query, setQuery] = useState("");
  const [filterForm, setFilterForm] = useState<SeekerSearchFilter>({
    countryCode: [],
    educationLevel: [],
    specialityIds: [],
    categoryIds: [],
  });

  const { data: seekers = [], total = 0 } = seekersData || {};
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  // Local state for filter form

  // Handle form filter changes
  const handleFilterChange = (newFormData: SeekerSearchFilter) => {
    setFilterForm(newFormData);
  };

  const updateSeeker = async (body: UserProfile) => {
    const newSeekerData = await update(
      API_UPDATE_SEEKER,
      { body },
      TAGS.profile,
      {
        error: {
          title: "Failed to update seeker profile",
          description: "Please try again.",
        },
        success: {
          title: "Seeker Profile Updated Successfully",
          description: "Your seeker profile has been updated successfully.",
        },
      },
    );
    if (newSeekerData) {
      const newSeekers = updateItemInArray(seekers, newSeekerData);
      setData?.({ data: newSeekers, total });
    }
  };

  const fields: FieldConfig[] = [
    {
      name: "countryCode",
      type: "select",
      textFieldProps: {
        placeholder: "Country",
      },
      options: countries.map((country) => ({
        value: country.isoCode,
        label: country.name,
      })),
    },
    {
      name: "educationLevel",
      type: "select",
      textFieldProps: {
        placeholder: "Education Level",
      },
      options: EducationLevel
        ? Object.values(EducationLevel).map((level) => ({
            value: level,
            label: level,
          }))
        : [],
    },
    {
      name: "specialityIds",
      type: "select",
      textFieldProps: {
        placeholder: "Specialty",
      },
      options:
        specialities.data.data.map((spec) => ({
          value: spec.id,
          label: spec.name,
        })) || [],
    },
    {
      name: "categoryIds",
      type: "select",
      textFieldProps: {
        placeholder: "Categories",
      },
      options:
        categories?.data.data.map((cat) => ({
          value: cat.id,
          label: cat.name,
        })) || [],
    },

    // {
    //   name: "gender",
    //   type: "select",
    //   textFieldProps: {
    //     placeholder: "Gender",
    //   },
    //   options: [
    //     { value: "male", label: "Male" },
    //     { value: "female", label: "Female" },
    //     { value: "other", label: "Other" },
    //   ],
    // },
    // {
    //   name: "experienceFrom",
    //   type: "select",
    //   textFieldProps: {
    //     placeholder: "Experience",
    //   },
    //   options: [
    //     { value: "0-2", label: "0-2 years" },
    //     { value: "3-5", label: "3-5 years" },
    //     { value: "6-10", label: "6-10 years" },
    //     { value: "10+", label: "10+ years" },
    //   ],
    // },
    // {
    //   name: "ageFrom",
    //   type: "select",
    //   textFieldProps: {
    //     placeholder: "age",
    //   },
    //   options: [
    //     { value: "0-2", label: "0-2 years" },
    //     { value: "3-5", label: "3-5 years" },
    //     { value: "6-10", label: "6-10 years" },
    //     { value: "10+", label: "10+ years" },
    //   ],
    // },
    // {
    //   name: "nationality",
    //   type: "select",
    //   textFieldProps: {
    //     placeholder: "Nationality",
    //   },
    //   options: nationalitiesOptions.map((nationality) => ({
    //     value: nationality.value,
    //     label: nationality.label,
    //   })),
    // },
    // {
    //   name: "status",
    //   type: "select",
    //   textFieldProps: {
    //     placeholder: "Status",
    //   },
    //   options: [
    //     { value: "active", label: "Active" },
    //     { value: "inactive", label: "Inactive" },
    //   ],
    // },
  ];

  const handleAction = ({
    type,
    data,
  }: {
    type: string;
    data: UserProfile;
  }) => {
    if (type === "seeker-update") {
      updateSeeker(data);
    }
  };

  const defaultVisibleColumns = [
    "Name",
    "Title",
    "Date",
    "Phone",
    "Location",
    "Category",
    "Specialty",
    "Career Level",
    "Status",
  ];

  return (
    <div className="grid grid-cols-1 space-y-1 rounded-base border border-gray-200 bg-white shadow-soft">
      <div className="border-b border-gray-200">
        <div className="flex flex-col justify-between md:flex-row md:items-end">
          <div className="w-full">
            <div className="flex flex-col justify-between gap-3 md:flex-row">
              <h5 className="w-full p-4 pb-1 text-xl font-semibold text-main">
                All Seekers
                <span className="ml-1 text-xs text-muted-foreground">({total})</span>
              </h5>
              <div className="flex w-full flex-col flex-wrap items-end gap-2 p-2 md:flex-row">
                <TextField
                  className="w-full flex-1"
                  variant="outlined"
                  placeholder="Search Seekers"
                  value={query}
                  InputProps={{
                    startAdornment: <Search />,
                  }}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1">
              <Tabs
                value={activeTab}
                onChange={(_, value) => setActiveTab(value)}
                aria-label="Seeker tabs"
                variant="scrollable"
                scrollButtons={false}
                className="text-base"
              >
                {tabs.map((tab) => (
                  <Tab
                    key={tab}
                    className="text-nowrap text-xs"
                    label={tab}
                    value={tab}
                  />
                ))}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <div className="scroll-bar-minimal flex flex-wrap gap-2 overflow-hidden overflow-x-auto border-b border-gray-200 p-3 md:flex-nowrap">
        {fields.map((field) => (
          <div className="flex-1" key={field.name}>
            <FormField
              field={field}
              data={filterForm}
              setData={handleFilterChange}
            />
          </div>
        ))}

        <IconButton
          onClick={() => setIsFilterOpen(true)}
          className="h-[42px] w-[42px] rounded-base border border-solid border-zinc-400 p-2 text-primary hover:border-primary"
        >
          <Filter className="h-4 w-4" />
        </IconButton>
        <FilterDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          sections={searchFilters}
        />
      </div>
      <DataTable
        data={seekers}
        total={total}
        selected={selected}
        setSelected={setSelected}
        isSelectable={true}
        searchQuery={query}
        fixedNumberPerPage={limit}
        cellClassName="p-2 text-sm"
        headerClassName="p-2 text-sm"
        tableHeaderClass="border-b  border-gray-200 p-3"
        className="border-none"
        columns={getCols(handleAction)}
        defaultVisibleColumns={defaultVisibleColumns}
        exportOptions={[
          { label: "PDF", action: () => console.log("Exporting") },
          { label: "CSV", action: () => console.log("Exporting") },
        ]}
        columnManager={true}
        actionOptions={[
          {
            label: "View",
            icon: <Eye className="h-4 w-4" />,
            action: () => console.log("Viewing", ""),
          },
          {
            label: "Edit",
            icon: <Edit className="h-4 w-4" />,
            action: () => console.log("Editing", ""),
          },
          {
            label: "Delete",
            icon: <Trash className="h-4 w-4 text-red-500" />,
            action: () => console.log("Deleting", ""),
          },
          {
            label: "Send Message",
            icon: <MessageSquare className="h-4 w-4" />,
            action: () => console.log("Sending Message", ""),
          },
          {
            label: "Send Email",
            icon: <Mail className="h-4 w-4" />,
            action: () => console.log("Sending Email", ""),
          },
          {
            label: "Invite to Apply",
            icon: <User className="h-4 w-4" />,
            action: () => console.log("Inviting to Apply", ""),
          },
        ]}
        options={[
          {
            label: "View",
            icon: <Eye className="h-4 w-4" />,
            action: () => console.log("Viewing", ""),
          },
          {
            label: "Edit",
            icon: <Edit className="h-4 w-4" />,
            action: () => console.log("Editing", ""),
          },
          {
            label: "Delete",
            icon: <Trash className="h-4 w-4 text-red-500" />,
            action: () => console.log("Deleting", ""),
          },
          {
            label: "Send Message",
            icon: <MessageSquare className="h-4 w-4" />,
            action: () => console.log("Sending Message", ""),
          },
          {
            label: "Send Email",
            icon: <Mail className="h-4 w-4" />,
            action: () => console.log("Sending Email", ""),
          },
          {
            label: "Invite to Apply",
            icon: <User className="h-4 w-4" />,
            action: () => console.log("Inviting to Apply", ""),
          },
        ]}
      />
    </div>
  );
};

const getCols = (
  action?: ({ type, data }: { type: string; data: UserProfile }) => void,
): ColumnConfig<UserProfile>[] => [
  {
    key: "firstName",
    header: "Name",
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-2">
        <Avatar src={item.avatar} />
        <div>
          <Link
            href={`/admin/seekers/${item.userName}`}
            className="line-clamp-1 text-sm"
          >
            {formatName(item, true)}
          </Link>
          <Link
            href={`mailto:${item.email}`}
            className="line-clamp-1 break-all text-xs underline hover:no-underline"
          >
            {item.email}
          </Link>
        </div>
      </div>
    ),
  },
  {
    key: "title",
    header: "Title",
    sortable: true,
    render: (item) => (
      <Tooltip title={getExperienceDetail(item.title || "")}>
        <p className="line-clamp-2 text-sm">
          {getExperienceDetail(item.title || "")}
        </p>
      </Tooltip>
    ),
  },
  {
    key: "created_at",
    header: "Date",
    sortable: true,
    render: (item) => (
      <p className="text-nowrap text-sm">{formatDate(item.created_at)}</p>
    ),
  },
  {
    key: "phone",
    header: "Phone",
    sortable: true,
    render: (item) =>
      item.phone ? (
        <a href={`tel:${item.phone}`} className="hover:underline">
          {item.phone}
        </a>
      ) : (
        "-"
      ),
  },
  {
    header: "Location",
    render: (item) => (
      <Tooltip title={formatLocation(item)}>
        <p className="line-clamp-2 text-sm">{formatLocation(item)}</p>
      </Tooltip>
    ),
  },
  {
    key: "category",
    header: "Category",
    sortable: true,
  },
  {
    key: "speciality",
    header: "Specialty",
    sortable: true,
  },
  {
    key: "careerLevel",
    header: "Career Level",
    sortable: true,
  },

  {
    key: "gender",
    header: "Gender",
    sortable: true,
    render: (item) => {
      const icon = genderIcons[item.gender as keyof typeof Gender];
      return (
        <div className="flex items-center gap-1">
          {icon} {item.gender}
        </div>
      );
    },
  },
  {
    key: "nationality",
    header: "Nationality",
    sortable: true,
  },
  {
    key: "maritalStatus",
    header: "Marital Status",
    sortable: true,
  },
  {
    key: "hasDrivingLicence",
    header: "Driving License",
    sortable: true,
    render: (item) => (item.hasDrivingLicence ? "Yes" : "No"),
  },
  {
    key: "isPublic",
    header: "Public Profile",
    sortable: true,
    render: (item) => (
      <CheckboxField
        field={{
          name: "isPublic",
          type: "checkbox",
        }}
        controllerField={{
          value: item.isPublic,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            action?.({
              type: "seeker-update",
              data: {
                id: item.id,
                isPublic: e.target.checked,
              } as UserProfile,
            }),
        }}
      />
    ),
  },
  {
    header: "Age",
    render: (item) => {
      if (!item.birthDate) return "-";
      const birthYear = new Date(item.birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      return currentYear - birthYear;
    },
  },
  {
    header: "Experience",
    render: (item) => "",
    // item.total_years_experience != null
    //   ? `${Math.round(item.total_years_experience)} yrs`
    //   : "-",
  },
  {
    key: "languages",
    header: "Languages",
    render: (item) => {
      const languages =
        item.languages
          ?.map((lang) => `${lang.name} (${lang.proficiency})`)
          .join(", ") || "-";
      return (
        <Tooltip title={languages}>
          <p className="line-clamp-2 min-w-32 text-sm">{languages}</p>
        </Tooltip>
      );
    },
  },
  {
    key: "whatsapp",
    header: "WhatsApp",
    sortable: true,
  },
  {
    key: "resume",
    header: "Resume",
    render: (item) =>
      item.resume ? (
        <IconButton
          className="border border-solid border-gray-400"
          onClick={() => item.resume && window.open(item.resume, "_blank")}
        >
          <Download className="h-4 w-4" />
        </IconButton>
      ) : (
        "Not Available"
      ),
  },
  {
    key: "socialLinks",
    header: "Social Links",
    render: (item) => {
      if (!item.socialLinks) return "No Social media";
      return (
        <div className="flex gap-2">
          {Object.entries(item.socialLinks)
            .filter(([_, value]) => value)
            .map(([key, link]) => (
              <Tooltip key={key} title={key} placement="bottom">
                <Link href={link} target="_blank" rel="noopener noreferrer">
                  {socialMediaIcons[key as keyof SocialMediaLinks] || (
                    <LinkOutlined />
                  )}
                </Link>
              </Tooltip>
            ))}
        </div>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    render: (item) =>
      "",
      //TODO: <CheckboxField
      //   field={{
      //     name: "status",
      //     type: "checkbox",
      //   }}
      //   controllerField={{
      //     value: item.status,
      //     onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      //       action?.({
      //         type: "seeker-update",
      //         data: {
      //           ...item,
      //           status: e.target.checked,
      //         } as UserProfile,
      //       }),
      //   }}
      // />
  },
];

export default SeekersTable;
