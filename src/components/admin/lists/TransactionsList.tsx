import AdvancedDataTable from "@/components/UI/AdvancedDataTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { TRANSACTIONS } from "@/constants/subscriptionPlans";
import { TransactionType } from "@/types/finance";
import { generateTransactionsColumns } from "@/components/columns/transactionsColumns";

const generateTransaction = (): TransactionType[] => TRANSACTIONS;

const TransactionsList: React.FC = () => {
  const transactions = generateTransaction();
  const columns = generateTransactionsColumns();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-3 text-2xl">
          All Transactions
          <span className="ml-1 text-muted-foreground">({transactions.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <AdvancedDataTable
          columns={columns}
          data={transactions}
          filters={[
            { key: "plan" },
            { key: "created_at" },
            { key: "total_amount" },
            { key: "payment_method" },
            { key: "type" },
          ]}
          defaultSorting={{
            id: "created_at",
            desc: false,
          }}
          headerClassName="text-sm"
          cellClassName="text-xs"
          filterClassName="px-5"
          paginationClassName="px-5"
          tableClassName="border-t border-b"
          initialPagination={{
            pageIndex: 0,
            pageSize: 10,
          }}
          hideSearch={false}
          hideExport={false}
          hideColumnManager={false}
          hidePagination={false}
        />
      </CardContent>
    </Card>
  );
};

export default TransactionsList;
