"use client";
import {
  Banknote,
  BarChart2,
  CreditCard,
  DollarSign,
  Handshake,
} from "lucide-react";
import StatusCard from "@/components/UI/StatusCard";
import Flag from "@/components/UI/flagitem";
import FinanceCharts from "@/components/charts/finance-chart";
import { TOP_REVENUE_PLANS, TRANSACTIONS } from "@/constants/subscriptionPlans";
import { formatMoney } from "@/util/general";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import AdvancedDataTable from "@/components/UI/AdvancedDataTable";
import { AdvancedColumnConfig } from "@/types";
import { PlansReport, TransactionType } from "@/types/finance";
import { generateTransactionsColumns } from "@/components/columns/transactionsColumns";

type TopCountry = {
  id: string;
  code: string;
  name: string;
  job: number;
  employers: number;
  revenue: string;
};

const topCountriesData: TopCountry[] = [
  {
    id: "1",
    code: "EG",
    name: "Egypt",
    job: 18,
    employers: 35,
    revenue: "75k",
  },
  {
    id: "2",
    code: "US",
    name: "United States",
    job: 120,
    employers: 250,
    revenue: "1.2M",
  },
  {
    id: "3",
    code: "IN",
    name: "India",
    job: 95,
    employers: 180,
    revenue: "850k",
  },
  {
    id: "4",
    code: "DE",
    name: "Germany",
    job: 45,
    employers: 90,
    revenue: "500k",
  },
  {
    id: "5",
    code: "JP",
    name: "Japan",
    job: 60,
    employers: 110,
    revenue: "700k",
  },
  {
    id: "6",
    code: "AU",
    name: "Australia",
    job: 30,
    employers: 65,
    revenue: "400k",
  },
];
const statusCards: StatusCardType[] = [
  {
    title: "Gross Revenue",
    value: "$78,500",
    icon: (
      <DollarSign className="block h-11 w-11 rounded-full bg-green-100 p-2 text-green-800" />
    ),
    trend: {
      value: "+15%",
      description: "vs last quarter",
      trendDirection: "up",
    },
  },
  {
    title: "Net Profit",
    value: "$42,300",
    icon: (
      <Banknote className="block h-11 w-11 rounded-full bg-blue-100 p-2 text-blue-800" />
    ),
    trend: {
      value: "+22%",
      description: "Improved margins",
      trendDirection: "up",
    },
  },
  {
    title: "Avg. Revenue per Employer",
    value: "$320",
    icon: (
      <BarChart2 className="block h-11 w-11 rounded-full bg-purple-100 p-2 text-purple-800" />
    ),
    trend: {
      value: "+8%",
      description: "Premium adoption up",
      trendDirection: "up",
    },
  },
  {
    title: "Recruiter Payouts",
    value: "$18,750",
    icon: (
      <Handshake className="block h-11 w-11 rounded-full bg-amber-100 p-2 text-amber-800" />
    ),
    trend: {
      value: "+14%",
      description: "More successful hires",
      trendDirection: "up",
    },
  },
  {
    title: "Operating Costs",
    value: "$36,200",
    icon: (
      <CreditCard className="block h-11 w-11 rounded-full bg-red-100 p-2 text-red-800" />
    ),
    trend: {
      value: "-5%",
      description: "Cost optimization",
      trendDirection: "down",
    },
  },
];

const generateTopPlansColumns = (): AdvancedColumnConfig<PlansReport>[] => [
  {
    header: "Rank",
    accessorKey: "id",
    size: 5,
    cell: ({ row }) => (
      <div className="text-xs font-medium">#{row.getValue("id")}</div>
    ),
  },

  {
    header: "Plan",
    accessorKey: "name",
  },
  {
    header: "Purchases",
    accessorKey: "purchases",
  },
  {
    header: "Revenue",
    accessorKey: "revenue",
    cell: ({ row }) => (
      <div className="text-xs font-medium text-green-600">
        ${formatMoney(row.getValue("revenue"))}
      </div>
    ),
  },
];
const generateTopCountriesColumns = (): AdvancedColumnConfig<TopCountry>[] => [
  {
    header: "Rank",
    accessorKey: "id",
    size: 5,
    cell: ({ row }) => (
      <div className="text-xs font-medium">#{row.getValue("id")}</div>
    ),
  },

  {
    header: "Country",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Flag {...row.original} />
        <div className="text-xs">{row.getValue("name")}</div>
      </div>
    ),
  },
  {
    header: "Employers",
    accessorKey: "employers",
  },
  {
    header: "Jobs",
    accessorKey: "job",
  },
  {
    header: "Revenue",
    accessorKey: "revenue",
    cell: ({ row }) => (
      <div className="text-xs font-medium text-green-600">
        ${formatMoney(row.getValue("revenue"))}
      </div>
    ),
  },
];

const generateTransaction = (): TransactionType[] => TRANSACTIONS;

const TransactionsOverView: React.FC = () => {
  const topPlansColumns = generateTopPlansColumns();
  const topCountriesColumns = generateTopCountriesColumns();

  const transactions = generateTransaction().slice(0, 6);
  const columns = generateTransactionsColumns();

  return (
    <div className="space-y-2">
      {/* start Overveiw page */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
        {statusCards.map((card) => (
          <StatusCard key={card.title} {...card} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-8">
        <div className="col-span-1 h-full lg:col-span-5">
          <FinanceCharts />
        </div>
        <div className="col-span-1 flex flex-col gap-3 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>
                Top Plans
                <span className="ml-1 text-xs text-muted-foreground">
                  (
                  {formatMoney(
                    TOP_REVENUE_PLANS.reduce(
                      (sum, plan) => sum + plan.revenue,
                      0,
                    ),
                  )}
                  )
                </span>
              </CardTitle>
            </CardHeader>
            <AdvancedDataTable
              columns={topPlansColumns}
              data={TOP_REVENUE_PLANS}
              defaultSorting={{
                id: "id",
                desc: false,
              }}
              headerClassName="text-xs"
              cellClassName="text-xs"
              tableClassName="border-t border-b"
              initialPagination={{
                pageIndex: 0,
                pageSize: 10,
              }}
            />
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                Top Countries
                <span className="ml-1 text-xs text-muted-foreground">(Revenue)</span>
              </CardTitle>
            </CardHeader>
            <AdvancedDataTable
              columns={topCountriesColumns}
              data={topCountriesData}
              defaultSorting={{
                id: "id",
                desc: false,
              }}
              headerClassName="text-xs"
              cellClassName="text-xs"
              tableClassName="border-t border-b"
              initialPagination={{
                pageIndex: 0,
                pageSize: 10,
              }}
            />
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="mb-3 text-2xl">
            Recent Transactions
            <span className="ml-1 text-muted-foreground">({transactions.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <AdvancedDataTable
            columns={columns}
            data={transactions}
            defaultSorting={{
              id: "created_at",
              desc: false,
            }}
            headerClassName="text-sm"
            cellClassName="text-xs"
            filterClassName="px-5"
            paginationClassName="px-5"
            tableClassName="border-t border-b"
            initialPagination={{
              pageIndex: 0,
              pageSize: 10,
            }}
            hideSearch={false}
            hideExport={false}
            hideColumnManager={false}
          />
        </CardContent>
      </Card>
    </div>
  );
};
export default TransactionsOverView;
