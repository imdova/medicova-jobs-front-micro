"use client";
import InvoiceForm from "@/components/settings/invoiceForm";
import { INVOICES_DATA } from "@/constants/invoices.data";
import { Button } from "@mui/material";
import { Download, Printer, Send, SquarePen } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const Page = ({ params: { id } }: { params: { id: string } }) => {
  const invoice = INVOICES_DATA.find((x) => x.id === id);
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "my-document", // (optional) name for PDF file
  });

  return (
    <div className="my-8">
      <div className="flex items-center justify-end gap-2 p-4">
        <Button
          onClick={handlePrint}
          startIcon={<Printer size={14} />}
          className="border border-solid border-gray-200 bg-blue-50 text-sm text-blue-600 hover:bg-blue-100 hover:text-blue-700"
        >
          Print
        </Button>
        <Button
          LinkComponent={Link}
          href={`/admin/invoices/edit/${id}`}
          startIcon={<SquarePen size={14} />}
          className="border border-solid border-gray-200 bg-green-50 text-sm text-green-600 hover:bg-green-100 hover:text-green-700"
        >
          Edit
        </Button>
        <Button
          startIcon={<Download size={14} />}
          className="border border-solid border-gray-200 bg-purple-50 text-sm text-purple-600 hover:bg-purple-100 hover:text-purple-700"
        >
          Save
        </Button>
        <Button
          startIcon={<Send size={14} />}
          className="border border-solid border-gray-200 bg-orange-50 text-sm text-orange-600 hover:bg-orange-100 hover:text-orange-700"
        >
          Send Invoice
        </Button>
      </div>
      <InvoiceForm />;
    </div>
  );
};

export default Page;
