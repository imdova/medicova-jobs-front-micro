"use Client";
import InvoiceForm from "@/components/settings/invoiceForm";
import { INVOICES_DATA } from "@/constants/invoices.data";
import { Button } from "@mui/material";
import { Download } from "lucide-react";

const Page = ({ params: { id } }: { params: { id: string } }) => {
  const invoice = INVOICES_DATA.find((x) => x.id === id);
  return (
    <div className="my-8">
      <div className="flex items-center justify-end gap-2 p-4">
        <Button
          startIcon={<Download size={14} />}
          className="border border-solid border-gray-200 bg-purple-50 text-sm text-purple-600 hover:bg-purple-100 hover:text-purple-700"
        >
          Update
        </Button>
      </div>
      <InvoiceForm />;
    </div>
  );
};

export default Page;
