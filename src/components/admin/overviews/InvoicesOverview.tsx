"use client";
import {
  BriefcaseBusiness,
  ShieldCheck,
  Clock,
  AlertCircle,
  XCircle,
  DollarSign,
  Plus,
} from "lucide-react";
import StatusCard from "@/components/UI/StatusCard";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/UI/card";
import { useState } from "react";
import { generateInvoicesColumns } from "@/components/columns/invoicesColumns";
import { InvoiceType } from "@/types/finance";
import { INVOICES_DATA } from "@/constants/invoices.data";
import { Button } from "@/components/UI/button";
import Link from "next/link";
import AdvancedDataTable from "@/components/UI/AdvancedDataTable";

type Trend = {
  value: string;
  trendDirection: "up" | "down";
};

type StatusCardType = {
  title: string;
  value: string | number;
  trend?: Trend;
  icon: JSX.Element;
};

const generateInvoices = (): InvoiceType[] => INVOICES_DATA;

export const statusCards: StatusCardType[] = [
  {
    title: "Total Invoices",
    value: 120,
    trend: { value: "12%", trendDirection: "up" },
    icon: (
      <BriefcaseBusiness className="block h-11 w-11 rounded-full bg-blue-100 p-2 text-blue-800" />
    ),
  },
  {
    title: "Paid Invoices",
    value: 95,
    trend: { value: "8%", trendDirection: "up" },
    icon: (
      <ShieldCheck className="block h-11 w-11 rounded-full bg-green-100 p-2 text-green-700" />
    ),
  },
  {
    title: "Pending Invoices",
    value: 15,
    trend: { value: "5%", trendDirection: "down" },
    icon: (
      <Clock className="block h-11 w-11 rounded-full bg-yellow-100 p-2 text-yellow-800" />
    ),
  },
  {
    title: "Overdue Invoices",
    value: 7,
    trend: { value: "2%", trendDirection: "up" },
    icon: (
      <AlertCircle className="block h-11 w-11 rounded-full bg-red-100 p-2 text-red-800" />
    ),
  },
  {
    title: "Cancelled Invoices",
    value: 3,
    trend: { value: "1%", trendDirection: "down" },
    icon: (
      <XCircle className="block h-11 w-11 rounded-full bg-gray-100 p-2 text-gray-700" />
    ),
  },
  {
    title: "Pending Payments",
    value: "$2,300",
    trend: { value: "10%", trendDirection: "down" },
    icon: (
      <DollarSign className="block h-11 w-11 rounded-full bg-yellow-100 p-2 text-yellow-800" />
    ),
  },
  {
    title: "Collected Revenue",
    value: "$18,750",
    trend: { value: "15%", trendDirection: "up" },
    icon: (
      <DollarSign className="block h-11 w-11 rounded-full bg-green-100 p-2 text-green-700" />
    ),
  },
  {
    title: "Refunded Amount",
    value: "$540",
    trend: { value: "3%", trendDirection: "down" },
    icon: (
      <DollarSign className="block h-11 w-11 rounded-full bg-gray-100 p-2 text-gray-700" />
    ),
  },
];

const InvoicesOverview: React.FC = () => {
  const [invoices, setInvoices] = useState(generateInvoices().slice(0, 10));
  const columns = generateInvoicesColumns();
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        {statusCards.map((card) => (
          <StatusCard key={card.title} {...card} />
        ))}
      </div>
      <Card>
        <CardHeader className="mb-5">
          <CardTitle className="text-2xl">
            Recent Invoices
            <span className="ml-1 text-muted-foreground">({invoices.length})</span>
          </CardTitle>
          <CardAction>
            <Button asChild variant="outline">
              <Link href="/admin/invoices/create">
                <Plus />
                Create Invoice
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <AdvancedDataTable
          columns={columns}
          data={invoices}
          setData={setInvoices}
          defaultSorting={{
            id: "revenue",
            desc: true,
          }}
          headerClassName="text-sm"
          cellClassName="text-xs"
          filterClassName="px-5 justify-between"
          paginationClassName="px-5"
          tableClassName="border-t border-b"
          initialPagination={{
            pageIndex: 0,
            pageSize: 10,
          }}
          hideColumnManager={false}
          hideSearch={false}
          hideExport={false}
        />
      </Card>
    </div>
  );
};
export default InvoicesOverview;
