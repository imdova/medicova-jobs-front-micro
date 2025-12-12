// src/components/BillingHistory.tsx
import React from "react";
import StatusBadge from "./StatusBadge";
import { BillingRecord } from "../types/types";
import { ColumnConfig } from "@/types";
import DataTable from "@/components/UI/data-table";
import { Eye } from "lucide-react";
import Link from "next/link";
import { Button, ListItemIcon } from "@mui/material";

interface BillingHistoryProps {
  records: BillingRecord[];
}

const BillingHistory: React.FC<BillingHistoryProps> = ({ records }) => {
  const columns: ColumnConfig<BillingRecord>[] = [
    {
      header: "Invoice",
      key: "invoiceNumber",
      render: (record: BillingRecord) => (
        <div className="flex items-center">
          <svg
            className="h-5 w-5 flex-shrink-0 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-sm font-medium text-gray-900">
            Invoice #{record.invoiceNumber} - {record.date.split(",")[0]}
          </div>
        </div>
      ),
    },
    {
      header: "Date",
      key: "date",
    },
    {
      header: "Amount",
      key: "amount",
    },
    {
      header: "Plan",
      key: "plan",
    },
    {
      header: "Unlocks",
      key: "users",
    },
    {
      header: "Status",
      key: "status",
      render: (record: BillingRecord) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            record.status === "paid"
              ? "bg-green-50 text-green-700"
              : record.status === "pending"
                ? "bg-yellow-50 text-yellow-700"
                : "bg-red-50 text-red-700"
          }`}
        >
          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
        </span>
      ),
    },
    {
      render: (record: BillingRecord) => (
        <button
          type="button"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <svg
            className="-ml-1 mr-1 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Download
        </button>
      ),
    },
  ];
  const handleDownloadCSV = (data: BillingRecord[]) => {
    // Create CSV content
    const headers = ["Invoice", "Date", "Amount", "Plan", "Users", "Status"];
    const csvContent = [
      headers.join(","),
      ...data.map((record) =>
        [
          `Invoice #${record.invoiceNumber}`,
          record.date,
          record.amount,
          record.plan,
          record.users,
          record.status,
        ].join(","),
      ),
    ].join("\n");

    // Create and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `billing-history-${new Date().toISOString().split("T")[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Billing history</h3>
          <p className="mt-1 text-sm text-gray-500">
            Download your previous plan receipts and usage details.
          </p>
        </div>
        <Button
          variant="contained"
          onClick={() => handleDownloadCSV(records)}
          className="inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Download all
        </Button>
      </div>

      <DataTable
        data={records}
        columns={columns}
        isSelectable={true}
        options={[
          {
            label: (item) => (
              <Link href={`#`} className="w-full">
                <ListItemIcon>
                  <Eye className="h-4 w-4" />
                </ListItemIcon>
                View
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
};

export default BillingHistory;
