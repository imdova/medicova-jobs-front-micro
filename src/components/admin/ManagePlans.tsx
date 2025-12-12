import PlanCard from "@/components/plan/planCard";
import AdvancedDataTable from "@/components/UI/AdvancedDataTable";
import { Button } from "@/components/UI/button";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/UI/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import { SUBSCRIPTION_PLANS } from "@/constants/subscriptionPlans";
import { SubscriptionPlan } from "@/types/finance";
import { Grid, List, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { generateManagePlansColumns } from "@/components/columns/plansColumns";

const generatePlans = (): SubscriptionPlan[] => SUBSCRIPTION_PLANS;

interface ManagePlansProps {
  title?: string;
  hideFilters?: boolean;
  data?: SubscriptionPlan[];
}

const ManagePlans: React.FC<ManagePlansProps> = ({
  title = "All plans",
  hideFilters = false,
  data,
}) => {
  const [plans, setPlans] = useState(data ?? generatePlans());

  const columns = generateManagePlansColumns();

  const handleGetStarted = (planName: string) => {
    console.log(`Getting started with ${planName} plan`);
    // Add your logic here
  };

  return (
    <Tabs defaultValue="list">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {title}
            <span className="ml-1 text-muted-foreground">({plans.length})</span>
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
            <Button asChild variant="outline">
              <Link href="/admin/plans/create">
                <Plus />
                Create Plan
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
      </Card>

      <TabsContent value="list">
        <Card>
          <AdvancedDataTable
            columns={columns}
            data={plans}
            setData={setPlans}
            hideSearch={hideFilters}
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
            hideExport={hideFilters}
            hidePagination={hideFilters}
          />
        </Card>
      </TabsContent>
      <TabsContent value="grid">
        <div className="my-8 grid grid-cols-2 justify-center gap-3 lg:grid-cols-4">
          {SUBSCRIPTION_PLANS.filter((x) => !Boolean(x.optionTo)).map(
            (plan, index) => (
              <PlanCard
                edit={true}
                key={plan.name}
                plan={plan}
                index={index}
                onGetStarted={handleGetStarted}
              />
            ),
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ManagePlans;
