import AdvancedDataTable from "@/components/UI/AdvancedDataTable";
import { Button } from "@/components/UI/button";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/UI/card";
import { ADDONS_DATA } from "@/constants/subscriptionPlans";
import { Addon } from "@/types/finance";
import { generateManageAddonsColumns } from "@/components/columns/addOnsColumns";
import { Grid, List, Plus } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../UI/tabs";
import AddonCard from "../shared/AddonCard";

const generateAdOns = (): Addon[] => ADDONS_DATA;

const ManageAdOns = () => {
  const [addOns, setAdOns] = useState(generateAdOns());
  const columns = generateManageAddonsColumns();

  return (
    <Tabs defaultValue="list">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            AddOns
            <span className="ml-1 text-muted-foreground">({addOns.length})</span>
          </CardTitle>
          <CardAction>
            <TabsList className="shadow-xs inline-flex w-fit -space-x-px rounded-md rtl:space-x-reverse">
              <Button
                className="rounded-none rounded-s-base shadow-none focus-visible:z-10"
                variant="outline"
                asChild
              >
                <TabsTrigger value="list">
                  <List />
                  <span className="sr-only">List</span>
                </TabsTrigger>
              </Button>
              <Button
                className="rounded-none rounded-e-base shadow-none focus-visible:z-10"
                variant="outline"
                asChild
              >
                <TabsTrigger value="grid">
                  <Grid />
                </TabsTrigger>
              </Button>
            </TabsList>
            <Button variant="outline">
              <Plus />
              Create Add On
            </Button>
          </CardAction>
        </CardHeader>
      </Card>

      <TabsContent value="list">
        <Card>
          <AdvancedDataTable
            columns={columns}
            data={addOns}
            setData={setAdOns}
            hideSearch={false}
            defaultSorting={{
              id: "created_at",
              desc: false,
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
      </TabsContent>
      <TabsContent value="grid">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {addOns.map((addon, index) => (
            <AddonCard
              key={addon.id}
              addon={addon}
              onBuy={(a) => console.log("Buy", a)}
              index={index}
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ManageAdOns;
