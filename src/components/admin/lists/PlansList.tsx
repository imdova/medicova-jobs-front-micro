import AdvancedDataTable from "@/components/UI/AdvancedDataTable";
import { Button } from "@/components/UI/button";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/UI/card";
import { TOP_REVENUE_PLANS } from "@/constants/subscriptionPlans";
import { PlansReport } from "@/types/finance";
import { generatePlansColumns } from "@/components/columns/plansColumns";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const generatePlans = (): PlansReport[] => TOP_REVENUE_PLANS;

const PlansList: React.FC = () => {
  const [plans, setPlans] = useState(generatePlans());
  const columns = generatePlansColumns();

  return (
    <Card>
      <CardHeader className="mb-5">
        <CardTitle className="text-2xl">
          All Plans
          <span className="ml-1 text-muted-foreground">({plans.length})</span>
        </CardTitle>
        <CardAction>
          <Button asChild variant="outline">
            <Link href="/admin/plans/create">
              <Plus />
              Create Plan
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      <AdvancedDataTable
        columns={columns}
        data={plans}
        setData={setPlans}
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
        hideSearch={false}
        hideExport={false}
        hidePagination={false}
        hideColumnManager={false}
      />
    </Card>
  );
};

export default PlansList;
