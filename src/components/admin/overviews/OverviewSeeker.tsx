import DataTable from "@/components/UI/data-table";
import Flag from "@/components/UI/flagitem";
import { BotOff, MapPin, ShieldCheck, Timer, Users } from "lucide-react";
import StatusCard from "@/components/UI/StatusCard";
import useFetch from "@/hooks/useFetch";
import { API_GET_SEEKERS } from "@/api/seeker";
import { cn, formatName, formatDistanceToNow } from "@/util";
import { formatLocation, formatMoney } from "@/util/general";
import Avatar from "@/components/UI/Avatar";
import { Tab, Tabs, Tooltip, Typography } from "@mui/material";
import SeekerChart from "@/components/charts/seekers-charts";
import { Suspense, useState } from "react";
import { Option } from "@/types";
import SeekersTable from "./OverviewSeekersTable";
import { topCountriesData } from "@/constants/admin/index";
import { UserProfile } from "@/types/seeker";

type TopCountry = {
  id: string;
  code?: string;
  name: string;
  job: number;
  employers: number;
  revenue: number;
};

const statusCards: StatusCardType[] = [
  {
    title: "Total Users",
    value: "2,420",
    icon: (
      <Users className="block h-11 w-11 rounded-full bg-blue-50 p-2 text-blue-800" />
    ),
    trend: {
      value: "+20",
      description: "Since last Week",
      trendDirection: "up",
    },
  },
  {
    title: "Active Users",
    value: "1,517",
    icon: (
      <ShieldCheck className="block h-11 w-11 rounded-full bg-primary/10 p-2 text-primary" />
    ),
    trend: {
      value: "20%",
      trendDirection: "up",
    },
  },
  {
    title: "InActive Users",
    value: "903",
    icon: (
      <BotOff className="block h-11 w-11 rounded-full bg-amber-50 p-2 text-amber-800" />
    ),
    trend: {
      value: "20%",
      trendDirection: "down",
    },
  },
];

const OverviewSeeker: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-8">
        <OverViewCenter />
        <OverViewRight />
      </div>
      <Suspense>
        <SeekersTable />
      </Suspense>
    </div>
  );
};

const OverViewCenter: React.FC = () => {
  return (
    <div className="col-span-1 h-full lg:col-span-5">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {statusCards.map((card) => (
          <StatusCard key={card.title} {...card} />
        ))}
      </div>
      {/* Chart Section */}
      <div className="relative mt-3 h-[calc(100%-97px)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-soft">
        <SeekerChart />
      </div>
    </div>
  );
};

const tableTabs: Option[] = [
  { label: "Top Countries", value: "countries" },
  { label: "Top Categories", value: "categories" },
];
const topTypesData: TopCountry[] = [
  {
    id: "1",
    name: "Hospital",
    job: 120,
    employers: 250,
    revenue: 1200000,
  },
  {
    id: "2",
    name: "Medical Center",
    job: 95,
    employers: 180,
    revenue: 850000,
  },
  {
    id: "3",
    name: "Clinics and medical offices",
    job: 60,
    employers: 110,
    revenue: 700000,
  },
  {
    id: "4",
    name: "Rehabilitation Center",
    job: 45,
    employers: 90,
    revenue: 500000,
  },
  {
    id: "5",
    name: "Home Care",
    job: 30,
    employers: 65,
    revenue: 400000,
  },
  {
    id: "6",
    name: "Imaging and radiology center",
    job: 18,
    employers: 35,
    revenue: 75000,
  },
];

const OverViewRight = () => {
  const { data: Seeker, loading, setData } =
    useFetch<PaginatedResponse<UserProfile>>(API_GET_SEEKERS);
  const [topTableType, setTopTableType] = useState("countries");

  const topSeeker =
    Seeker?.data
      ?.filter((x) => Boolean(x.userName) && Boolean(x.firstName))
      .slice(0, 5) || [];
  return (
    <div className="col-span-1 flex flex-col gap-3 lg:col-span-3">
      {/* Performance Overview */}
      <div className="rounded-base border border-gray-200 bg-white shadow-soft">
        <div className="mb-2 flex items-center justify-between border-b p-3 pb-2">
          <h5 className="text-xl font-semibold text-main">
            Recent Job Seekers
            <span className="ml-1 text-sm text-muted-foreground">(5)</span>
          </h5>

          {/* <DummyActionMenu /> */}
        </div>

        <DataTable
          data={topSeeker}
          cellClassName="p-2 text-xs"
          className="border-none shadow-none"
          hideTableHeader={true}
          loading={loading}
          expectedLength={5}
          columns={[
            {
              render: (item) => (
                <div className="flex gap-2">
                  <Avatar
                    src={item.avatar}
                    alt={item.firstName + "image"}
                    size={32}
                  />
                  <Tooltip
                    title={
                      formatName(item, true) +
                      (item.speciality ? ` ,${item.speciality}` : "")
                    }
                  >
                    <div>
                      <p className="line-clamp-1 text-sm">
                        {formatName(item, true)}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {item.speciality}
                      </span>
                    </div>
                  </Tooltip>
                </div>
              ),
            },
            {
              render: (item) => (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1 min-w-20 text-xs">
                    {formatLocation(item)}
                  </span>
                </div>
              ),
            },
            {
              render: (item) => (
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  <span className="line-clamp-1 min-w-10 text-xs">
                    {formatDistanceToNow(item.created_at)}
                  </span>
                </div>
              ),
            },
          ]}
        />
      </div>
      {/* Top Countries */}
      <div className="rounded-base border border-gray-200 bg-white shadow-soft">
        <div className="grid grid-cols-1 border-b border-gray-200">
          <div>
            <Tabs
              value={topTableType}
              onChange={(e, value) => setTopTableType(value)}
              aria-label="basic tabs example"
              variant="scrollable"
              scrollButtons={false}
              className="text-base"
              sx={{
                minHeight: "unset",
                "& .MuiTab-root": {
                  minHeight: "unset",
                  padding: "12px 16px",
                  fontSize: "0.75rem",
                  textTransform: "none",
                  // whiteSpace: "nowrap",
                },
              }}
            >
              {tableTabs.map((tab) => (
                <Tab
                  key={tab.value}
                  label={
                    <h5
                      className={cn(
                        "text-sm font-semibold text-muted-foreground",
                        topTableType === tab.value && "text-main",
                      )}
                    >
                      {tab.label}
                    </h5>
                  }
                  value={tab.value}
                />
              ))}
            </Tabs>
          </div>
        </div>
        <DataTable
          data={topTableType === "countries" ? topCountriesData : topTypesData}
          defaultVisibleColumns={[
            "Rank",
            "Country",
            "categories",
            "Employers",
            "Jobs",
            "Revenue",
          ]}
          cellClassName="p-2 text-xs"
          className="border-none shadow-none"
          // searchQuery={query}
          columns={[
            {
              key: "id",
              header: "Rank",
              sortable: true,
              render: (item) => <div className="pl-2 text-xs">#{item.id}</div>,
            },
            {
              key: "name",
              header: topTableType === "countries" ? "Country" : "categories",

              sortable: true,
              render: (item) => (
                <div className="flex">
                  {item?.code && <Flag code={item?.code} name={item?.name} />}{" "}
                  <Tooltip title={item.name}>
                    <span className="ml-2 line-clamp-1 text-xs">
                      {item.name}
                    </span>
                  </Tooltip>
                </div>
              ),
            },
            {
              key: "employers",
              header: "Employers",
              sortable: true,
            },
            {
              key: "job",
              header: "Jobs",
              sortable: true,
            },
            {
              key: "revenue",
              header: "Revenue",
              sortable: true,
              render: (item) => (
                <div className="text-xs font-medium text-green-600">
                  ${formatMoney(item.revenue)}
                </div>
              ),
            },
          ]}
        />
      </div>
      {/* 
      <div className="h-full overflow-hidden rounded-xl border bg-white shadow-soft">
        <div className="mb-3 flex justify-between gap-8 p-3">
          <Typography>
            Top Countries
            <span className="ml-1 text-xs text-muted-foreground">(Revenue)</span>
          </Typography>
        </div>
        <div className="max-w-[calc(100vw-1rem)]">
          <DataTable
            data={topCountriesData}
            total={topCountriesData.length}
            cellClassName="p-2 text-xs"
            className="border-none shadow-none"
            // searchQuery={query}
            columns={[
              {
                key: "id",
                header: "Rank",
                sortable: true,
                render: (item) => (
                  <div className="pl-2 text-xs">#{item.id}</div>
                ),
              },
              {
                key: "name",
                header: "Country",
                sortable: true,
                render: (item) => (
                  <div className="flex">
                    <Flag {...item} />{" "}
                    <span className="ml-2 text-xs">{item.name}</span>
                  </div>
                ),
              },
              {
                key: "employers",
                header: "Employers",
                sortable: true,
              },
              {
                key: "job",
                header: "Jobs",
                sortable: true,
              },
              {
                key: "revenue",
                header: "Revenue",
                sortable: true,
              },
            ]}
          />
        </div>
      </div> */}
    </div>
  );
};

export default OverviewSeeker;
