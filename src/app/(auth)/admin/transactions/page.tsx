"use client";
import { Card } from "@/components/UI/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import TransactionsList from "@/components/admin/lists/TransactionsList";
import TransactionsOverView from "@/components/admin/overviews/TransactionsOverView";
import { Building2, LayoutList } from "lucide-react";

const page = () => {
  return (
    <Tabs defaultValue="over-view" className="my-8 w-full px-5">
      <Card className="flex w-full items-center justify-between gap-3 space-y-0 p-2">
        <TabsList>
          <TabsTrigger value="over-view">
            <LayoutList className="h-5 w-5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <Building2 className="h-5 w-5" />
            Transactions List
          </TabsTrigger>
        </TabsList>
      </Card>
      <TabsContent value="over-view">
        <TransactionsOverView />
      </TabsContent>
      <TabsContent value="transactions">
        <TransactionsList />
      </TabsContent>
    </Tabs>
  );
};

export default page;
