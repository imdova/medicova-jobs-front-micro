"use client";
import { Card } from "@/components/UI/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import { Building2, LayoutList } from "lucide-react";
import InvoicesOverview from "@/components/admin/overviews/InvoicesOverview";
import InvoicesList from "@/components/admin/lists/InvoicesList";

const page = () => {
  return (
    <Tabs defaultValue="over-view" className="my-8 w-full px-5">
      <Card className="flex w-full items-center justify-between gap-3 space-y-0 p-2">
        <TabsList>
          <TabsTrigger value="over-view">
            <LayoutList className="h-5 w-5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="invoices-list">
            <Building2 className="h-5 w-5" />
            Invoices List
          </TabsTrigger>
        </TabsList>
      </Card>
      <TabsContent value="over-view">
        <InvoicesOverview />
      </TabsContent>
      <TabsContent value="invoices-list">
        <InvoicesList />
      </TabsContent>
    </Tabs>
  );
};

export default page;
