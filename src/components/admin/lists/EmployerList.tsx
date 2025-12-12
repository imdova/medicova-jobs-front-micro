import {
  IconButton,
  ListItemIcon,
  Tab,
  Tabs,
  TextField,
  Tooltip,
} from "@mui/material";
import { PaidOutlined, Search } from "@mui/icons-material";
import { useState } from "react";
import DataTable from "@/components/UI/data-table";
import {
  BadgeVariant,
  ColumnConfig,
  Company,
  FieldConfig,
  Sector,
} from "@/types";
import Avatar from "@/components/UI/Avatar";
import Link from "next/link";
import { formatDate } from "@/util";
import useFetch from "@/hooks/useFetch";

import { useLocationData } from "@/hooks/useLocationData";
import { CheckboxField } from "@/components/form/FormModal/fields/CheckboxField";
import { TAGS } from "@/api";
import {
  API_GET_COMPANIES,
  API_SEARCH_COMPANIES,
  API_UPDATE_COMPANY,
} from "@/api/employer";
import useUpdateApi from "@/hooks/useUpdateApi";
import { CompanyStatus } from "@/constants/enums/company-status.enum";
import {
  Eye,
  Mail,
  Edit,
  MessageSquare,
  Filter,
  User,
  AlertTriangle,
  AlertCircle,
  Send,
  CheckSquare,
  XCircle,
  Info,
} from "lucide-react";
import { FormField } from "@/components/form/FormModal/fields/FormField";
import { companySizeOptions, employerFilters } from "@/constants";
import FilterDrawer from "@/components/UI/FilterDrawer";
import {
  getOptionLabel,
  toQueryString,
  updateItemInArray,
} from "@/util/general";
import { useSearchParams } from "next/navigation";
import AccountManagerModal from "@/components/UI/accountManagerModal";
import FormModal from "@/components/form/FormModal/FormModal";
import { useSession } from "next-auth/react";
import { ChatInitiatorEnum, ChatParticipantEnum } from "@/types/chat";
import { API_START_CHAT } from "@/api/general";
import CompanyFormModal from "@/components/admin/forms/CompanyFormModal";
import { useSectorsData } from "@/hooks/useSectorsData";
import { Badge } from "@/components/UI/Badge";
import { SUBSCRIPTION_PLANS } from "@/constants/subscriptionPlans";
import AssignPlanModal from "../forms/assignPlan";

// Defining tab options as a const array for better type safety and maintainability
const tabs = [
  { name: "all Employers", value: "all" },
  { name: "New Employers", value: "new" },
  { name: "Top Employers", value: "top" },
  { name: "Active Employers", value: "active" },
  { name: "Inactive Employers", value: "inactive" },
  { name: "Suspended Employers", value: "suspended" },
];

// FilterType combines SearchCompanyFilter with additional filter options
// This allows us to have a single type for all filter-related state management
type FilterType = {
  page?: number;
  limit?: number;
  q?: string;
  countryCode?: string;
  companyTypeId?: string;
  sector?: string;
  date?: string;
  size?: string;
  spends?: string;
};

const EmployerList: React.FC<{ compact?: boolean; companyIds?: string[] }> = ({
  compact = false,
  companyIds,
}) => {
  const { data: session } = useSession();
  const user = session?.user;
  // Extract page and limit from URL query params with fallback values
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const [toAcc, setToAcc] = useState<string | null>(null);

  const [companyToUpdate, setCompanyToUpdate] = useState<Company | null>(null);
  const closeUpdate = () => setCompanyToUpdate(null);

  // const [sendMessage, setSendMessage] = useState(false);
  // State management for filters that will be passed to the search API
  const [filters, setFilters] = useState<FilterType>({});

  // Fetch rarely-changing data at component level to avoid unnecessary re-renders
  const { countries } = useLocationData();
  const { sectors, types } = useSectorsData({ sectorId: "all" });

  // Setup API hooks for fetching and updating company data
  const { update } = useUpdateApi<Company>();
  const { data, loading, setData } = useFetch<PaginatedResponse<Company>>(
    API_GET_COMPANIES +
      toQueryString({
        page,
        limit,
        ...filters,
      }),
    {
      fetchOnUrlChange: true, // Re-fetch when URL changes
      fetchOnce: false, // Allow multiple fetches
    },
  );
  const { data: companies = [], total = 0 } = data || {};

  const filterCompanies = companies.filter((company) =>
    companyIds?.includes(company.id),
  );

  // UI state management
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selected, setSelected] = useState<(number | string)[]>([]);
  const [activeTab, setActiveTab] = useState<string>(tabs[0].value);

  // assign plan
  const [isPlanOpen, setIsPlanOpen] = useState<string | null>(null);

  // Handler for updating company data and refreshing the table
  const updateCompany = async (body: Company) => {
    const newCompany = await update(
      API_UPDATE_COMPANY,
      { body },
      TAGS.company,
      {
        error: {
          title: "Failed to update company",
          description: "Please try again.",
        },
        success: {
          title: "Company Updated Successfully",
          description: "Your company has been updated successfully.",
        },
      },
    );
    if (newCompany) {
      const newCompanies = updateItemInArray(companies, newCompany);
      setData?.({ data: newCompanies, total, limit, page });
    }
  };

  const changeCompaniesData = (company: Company) => {
    if (!company) return;
    const newCompanies = updateItemInArray(companies, company);
    setData?.({ data: newCompanies, total, limit, page });
  };

  // Filter field configurations
  // Note: Sector filter is temporarily commented out to simplify the UX
  const fields: FieldConfig[] = [
    {
      name: "countryCode",
      type: "search-select",
      textFieldProps: {
        placeholder: "country",
      },
      options: countries.map((country) => ({
        value: country.isoCode,
        label: country.name,
      })),
    },
    {
      name: "sector",
      type: "select",
      textFieldProps: {
        placeholder: "Sector",
      },
      resetFields: ["companyTypeId"],
      options:
        sectors?.data.data.map((sector: Sector) => ({
          value: sector.id,
          label: sector.name,
        })) || [],
      gridProps: { xs: 6 },
    },
    {
      name: "companyTypeId",
      type: "select",
      textFieldProps: {
        placeholder: "Company Type",
      },
      options:
        types?.data.data.map((type: Sector) => ({
          value: type.id,
          label: type.name,
        })) || [],
      gridProps: { xs: 6 },
    },
    {
      name: "size",
      type: "select",
      textFieldProps: {
        placeholder: "Company Size",
      },
      options: [
        { value: "1-10", label: "1-10 employees" },
        { value: "11-50", label: "11-50 employees" },
        { value: "51-200", label: "51-200 employees" },
        { value: "201-500", label: "201-500 employees" },
        { value: "501+", label: "501+ employees" },
      ],
      gridProps: { xs: 6 },
    },
    {
      name: "spends",
      type: "select",
      textFieldProps: {
        placeholder: "Spends",
      },
      options: [
        { value: "0-1000", label: "$0 - $1,000" },
        { value: "1000-5000", label: "$1,000 - $5,000" },
        { value: "5000-10000", label: "$5,000 - $10,000" },
        { value: "10000+", label: "$10,000+" },
      ],
      gridProps: { xs: 6 },
    },
    {
      name: "date",
      type: "date",
      textFieldProps: {
        placeholder: "Registration Date",
      },
    },
  ];

  const handleAction = ({ type, data }: { type: string; data: Company }) => {
    if (type === "company-update") {
      updateCompany(data);
    }
  };

  const cols = getCols(handleAction);

  // Messages
  const [userToSend, setUserToSend] = useState<Company | null>(null);
  const onClose = () => setUserToSend(null);
  const { update: SendAPI, isLoading, error } = useUpdateApi();
  const sendMessage = async (formData: any) => {
    if (!user || !userToSend) return;
    const body = {
      initiatorId: user.id,
      participantId: userToSend.id,
      initiatorType: "system_admin" as ChatInitiatorEnum,
      participantType: "company" as ChatParticipantEnum,
      messageText: formData.message,
      senderUserId: user.id,
    };
    await SendAPI(API_START_CHAT, {
      method: "POST",
      body,
    });
    onClose();
  };

  const companiesWithPlan = (companies: Company[]) => {
    const newCompanies: Company[] = [];
    companies.forEach((company) => {
      if (company.plan) {
        newCompanies.push(company);
      } else {
        newCompanies.push({ ...company, plan: SUBSCRIPTION_PLANS[0] });
      }
    });
    return newCompanies;
  };
  // TODO ADD Actions HERE
  const suspendedOptions: ActionOption<Company>[] =
    activeTab === "suspended"
      ? [
          {
            label: "Reinstate",
            icon: <CheckSquare className="h-4 w-4" />,
          },
          {
            label: "Permanently Ban",
            icon: <XCircle className="h-4 w-4 text-red-500" />,
          },
          {
            label: "View Reason",
            icon: <Info className="h-4 w-4" />,
          },
        ]
      : [
          {
            label: "Assign Account Manager",
            icon: <User className="h-4 w-4" />,
            action: (item) => setToAcc(item?.id || null),
          },
          {
            label: (
              <span className="text-orange-500">Send Suspend Warning</span>
            ),
            icon: <AlertCircle className="h-4 w-4 text-orange-500" />,
            action: () => console.log("Sending Suspend Warning", ""),
          },
          {
            label: <span className="text-red-500">Suspend</span>,
            icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
            action: () => console.log("Suspending", ""),
          },
        ];

  return (
    <>
      {companyToUpdate && (
        <CompanyFormModal
          isOpen={Boolean(companyToUpdate)}
          onClose={closeUpdate}
          company={companyToUpdate as Company}
          onSuccess={changeCompaniesData}
        />
      )}
      <AssignPlanModal
        employerId={isPlanOpen}
        open={Boolean(isPlanOpen)}
        onClose={() => setIsPlanOpen(null)}
      />
      <AccountManagerModal companyId={toAcc} onClose={() => setToAcc(null)} />
      {userToSend && (
        <FormModal
          open={Boolean(userToSend)}
          onClose={onClose}
          error={error?.message}
          loading={isLoading}
          onSubmit={sendMessage}
          fields={[
            {
              name: "message",
              label: "Message",
              type: "textArea",
            },
          ]}
          description={
            <div className="flex items-center gap-2">
              <Avatar
                size={60}
                src={userToSend.avatar}
                alt={userToSend.name + "image"}
              />
              <div>
                <h6 className="font-bold hover:underline">{userToSend.name}</h6>
                <p className="text-sm font-thin text-muted-foreground">
                  {userToSend.title}
                </p>
              </div>
            </div>
          }
          submitButtonText={
            <div className="flex items-center gap-2">
              Send
              <Send className="h-4 w-4" />
            </div>
          }
        />
      )}
      <div className="grid grid-cols-1 space-y-1 rounded-base border border-gray-200 bg-white shadow-soft">
        <div className="border-b border-gray-200">
          <div>
            <div>
              <div className="flex flex-col justify-between gap-3 md:flex-row">
                <h5 className="w-full p-3 pb-1 text-xl font-semibold text-main">
                  All Employers
                  <span className="ml-1 text-xs text-muted-foreground">({total})</span>
                </h5>
                <div className="flex w-full flex-col items-end gap-2 p-2 sm:flex-row">
                  <TextField
                    className="w-full"
                    variant="outlined"
                    placeholder="Search For Employer"
                    value={filters.q}
                    InputProps={{
                      startAdornment: <Search />,
                    }}
                    onChange={(e) =>
                      setFilters({ ...filters, q: e.target.value })
                    }
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
                        label={tab.name}
                        value={tab.value}
                      />
                    ))}
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!compact && (
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
        )}

        <DataTable
          data={
            Number(companyIds?.length) > 0
              ? companiesWithPlan(filterCompanies)
              : companiesWithPlan(companies)
          }
          total={total}
          selected={selected}
          setSelected={setSelected}
          isSelectable={true}
          searchQuery={filters.q}
          cellClassName="p-2 text-sm"
          headerClassName="p-2 text-sm"
          tableHeaderClass="border-b  border-gray-200 p-3"
          className="border-none"
          columns={cols}
          isUpperLimit={true}
          limit={limit}
          defaultVisibleColumns={[
            "Name",
            "Country",
            "State",
            "Type",
            "Sector",
            "phone",
            "Reg Date",
            "Jobs",
            "Spends",
            "Plan",
          ]}
          exportOptions={[
            { label: "PDF", action: () => console.log("Exporting") },
            { label: "CSV", action: () => console.log("Exporting") },
          ]}
          columnManager={true}
          actionOptions={[
            // {
            //   label: "Send Message",
            //   icon: <MessageSquare className="h-4 w-4" />,
            //   action: () => setUserToSend(true),
            // },
            {
              label: "Send Email",
              icon: <Mail className="h-4 w-4" />,
              action: () => console.log("Sending Email", ""),
            },
            {
              label: "Assign Account Manager",
              icon: <User className="h-4 w-4" />,
              action: (items) => setToAcc(items ? items[0]?.id : null),
            },

            {
              label: "Suspend",
              icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
              action: () => console.log("Suspending", ""),
            },
            {
              label: "Send Suspend Warning",
              icon: <AlertCircle className="h-4 w-4 text-orange-500" />,
              action: () => console.log("Sending Suspend Warning", ""),
            },
          ]}
          options={[
            {
              label: (item) => (
                <Link href={`/co/${item?.username}`} className="w-full">
                  <ListItemIcon>
                    <Eye className="h-4 w-4" />
                  </ListItemIcon>
                  View
                </Link>
              ),
            },
            {
              label: "Edit",
              icon: <Edit className="h-4 w-4" />,
              action: (company) => setCompanyToUpdate(company || null),
            },
            {
              label: "Send Message",
              icon: <MessageSquare className="h-4 w-4" />,
              action: (company) => setUserToSend(company || null),
            },
            {
              label: "Assign Plan",
              icon: <PaidOutlined className="h-4 w-4" />,
              action: (item) => setIsPlanOpen(item?.id || null),
            },
            {
              label: "Send Email",
              icon: <Mail className="h-4 w-4" />,
              action: () => console.log("Sending Email", ""),
            },
            ...suspendedOptions,
          ]}
        />
      </div>
    </>
  );
};

const badgeVariant: Record<string, BadgeVariant> = {
  Free: "neutral",
  Basic: "info",
  Pro: "success",
  Business: "premium",
};

const getCols = (
  action?: ({ type, data }: { type: string; data: Company }) => void,
): ColumnConfig<Company>[] => [
  {
    key: "name",
    header: "Name",
    sortable: true,
    render: (item) => (
      <div className="flex items-center gap-2">
        <Avatar src={item.avatar} />
        <div>
          <Tooltip title={item.name}>
            <Link
              className="transition hover:text-primary"
              href={`/admin/employers/${item.username}`}
            >
              <h6 className="line-clamp-1 text-sm">{item.name}</h6>
            </Link>
          </Tooltip>
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
    key: "username",
    header: "Username",
    sortable: true,
    render: (item) => (
      <Link
        className="line-clamp-1 text-sm transition hover:text-primary hover:underline"
        href={`/co/${item.username}`}
      >
        {item.username}
      </Link>
    ),
  },
  {
    key: "title",
    header: "Title",
    render: (item) => (
      <Tooltip title={item.title}>
        <p className="line-clamp-2 text-sm">{item.title}</p>
      </Tooltip>
    ),
  },

  {
    header: "Account Manager",
    render: (item) => (
      <div className="flex items-center gap-2">
        <Avatar src="https://randomuser.me/api/portraits/women/1.jpg" />
        <div>
          <Tooltip title="Alice Johnson">
            <Link
              className="transition hover:text-primary"
              href="/admin/account-managers/1"
            >
              <h6 className="line-clamp-1 text-sm">Alice Johnson</h6>
            </Link>
          </Tooltip>
          <Link
            href="mailto:alice@example.com"
            className="line-clamp-1 break-all text-xs underline hover:no-underline"
          >
            alice@example.com
          </Link>
        </div>
      </div>
    ),
  },
  {
    key: "about",
    header: "About",
    render: (item) => (
      <Tooltip title={item.about}>
        <p className="line-clamp-2 text-sm">{item.about}</p>
      </Tooltip>
    ),
  },
  {
    key: "completencePercent",
    header: "Completion %",
    sortable: true,
    render: (item) => `${item.completencePercent ?? 0}%`,
  },
  {
    key: "isPrivate",
    header: "Private",
    render: (item) => (
      <CheckboxField
        field={{
          name: "isPrivate",
          type: "checkbox",
        }}
        controllerField={{
          value: item.isPrivate,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            action?.({
              type: "company-update",
              data: {
                id: item.id,
                email: item.email,
                phone: item.phone,
                isPrivate: e.target.checked,
              } as Company,
            }),
        }}
      />
    ),
  },
  {
    key: "isProfitable",
    header: "Profitable",
    render: (item) => (
      <CheckboxField
        field={{
          name: "isProfitable",
          type: "checkbox",
        }}
        controllerField={{
          value: item.isProfitable,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            action?.({
              type: "company-update",
              data: {
                id: item.id,
                email: item.email,
                phone: item.phone,
                isProfitable: e.target.checked,
              } as Company,
            }),
        }}
      />
    ),
  },

  {
    key: "country.name",
    header: "Country",
    render: (item) => item.country?.name ?? "-",
  },
  {
    key: "state.name",
    header: "State",
    render: (item) => item.state?.name ?? "-",
  },
  { key: "city", header: "City" },
  {
    key: "size",
    header: "Company Size",
    render: (item) => getOptionLabel(companySizeOptions, item.size || null),
  },
  {
    key: "phone",
    header: "Phone",
    render: (item) =>
      item.phone ? (
        <a
          href={`tel:${item.phone}`}
          className="text-blue-500 hover:text-blue-700"
        >
          {item.phone}
        </a>
      ) : (
        "-"
      ),
  },
  {
    key: "yearFounded",
    header: "Founded",
    render: (item) => item.yearFounded ?? "-",
  },
  {
    key: "visible",
    header: "Visible",
    render: (item) => (
      <CheckboxField
        field={{
          name: "visible",
          type: "checkbox",
        }}
        controllerField={{
          value: item.visible,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            action?.({
              type: "company-update",
              data: {
                id: item.id,
                visible: e.target.checked,
              } as Company,
            }),
        }}
      />
    ),
  },
  {
    key: "companyTypeName",
    header: "Type",
    render: (item) => item.companyTypeName ?? "-",
  },
  {
    key: "companySectorName",
    header: "Sector",
    render: (item) => item.companySectorName ?? "-",
  },
  {
    key: "created_at",
    header: "Date",
    sortable: true,
    render: (item) => formatDate(item.created_at || ""),
  },
  {
    key: "updated_at",
    header: "Last Update",
    render: (item) => formatDate(item.updated_at || ""),
  },
  {
    key: "openJobs",
    header: "Jobs",
    render: (item) => <span className="text-sm">{item.openJobs ?? 0}</span>,
  },
  {
    key: "revenue",
    header: "Spends",
    render: (item) => <span className="text-sm">{item.revenue ?? 0}$</span>,
  },
  {
    header: "Plan",
    render: (item) =>
      item.plan?.badge && (
        <Badge variant={badgeVariant[item.plan.name]}>{item.plan.name}</Badge>
      ),
  },
  {
    key: "status",
    header: "Status",
    render: (item) => (
      <CheckboxField
        field={{
          name: "status",
          type: "checkbox",
        }}
        controllerField={{
          value: item.status === CompanyStatus.ACTIVE,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            action?.({
              type: "company-update",
              data: {
                id: item.id,
                email: item.email,
                phone: item.phone,
                status: e.target.checked
                  ? CompanyStatus.ACTIVE
                  : CompanyStatus.INACTIVE,
              } as Company,
            }),
        }}
      />
    ),
  },
];

export default EmployerList;
