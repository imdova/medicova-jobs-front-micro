import AdvancedDataTable from "@/components/UI/AdvancedDataTable";
import { Card, CardHeader, CardTitle } from "@/components/UI/card";
import { DUMMY_FEATURES } from "@/constants/subscriptionPlans";
import { useState } from "react";
import { Feature } from "@/types/finance";
import { generateManageFeaturesColumns } from "@/components/columns/featuresColumns";

const generateFeatures = (): Feature[] => DUMMY_FEATURES;

const ManageFeatures = () => {
  const [features, setFeatures] = useState(generateFeatures());

  const columns = generateManageFeaturesColumns();

  return (
    <div className="space-y-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            All Features
            <span className="ml-1 text-muted-foreground">({features.length})</span>
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <AdvancedDataTable
          columns={columns}
          data={features}
          setData={setFeatures}
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
    </div>
  );
};

export default ManageFeatures;
