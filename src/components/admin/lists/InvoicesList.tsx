import AdvancedDataTable from "@/components/UI/AdvancedDataTable";
import { Button } from "@/components/UI/button";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/UI/card";
import { INVOICES_DATA } from "@/constants/invoices.data";
import { InvoiceType } from "@/types/finance";
import { generateInvoicesColumns } from "@/components/columns/invoicesColumns";
import { Plus } from "lucide-react";
import Link from "next/link";

const generateInvoices = (): InvoiceType[] => INVOICES_DATA;

const InvoicesList: React.FC = () => {
  const invoices = generateInvoices();
  const columns = generateInvoicesColumns();

  return (
    <Card>
      <CardHeader className="mb-5">
        <CardTitle className="text-2xl">
          All Invoices
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
        hideSearch={false}
        hideColumnManager={false}
        filters={[
          { key: "created_at" },
          { key: "due_date" },
          { key: "created_by", className: "flex-1 min-w-32 max-w-44" },
          { key: "type", className: "flex-1 min-w-32 max-w-44" },
          {
            key: "payment_method",
            className: "flex-1 min-w-32 max-w-44",
          },
          { key: "total", className: "flex-1 min-w-32 max-w-44" },
          { key: "payment_type", className: "flex-1 min-w-32 max-w-44" },
          { key: "employer", className: "flex-1 min-w-32 max-w-44" },
          { key: "status", className: "flex-1 min-w-32 max-w-44" },
        ]}
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
        hideExport={false}
        hidePagination={false}
      />
    </Card>
  );
};

export default InvoicesList;
