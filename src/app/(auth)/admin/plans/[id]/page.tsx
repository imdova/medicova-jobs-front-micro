"use client";

import { API_GET_COMPANIES } from "@/api/employer";
import AdvancedDataTable from "@/components/UI/AdvancedDataTable";
import { Badge } from "@/components/UI/Badge";
import { Button } from "@/components/UI/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuTrigger,
} from "@/components/UI/dropdown-menu";
import InfoBlock from "@/components/UI/info-block";
import StatusCard from "@/components/UI/StatusCard";
import { Switch } from "@/components/UI/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/UI/tabs";
import {
  SUBSCRIPTION_PLANS,
  TRANSACTIONS,
} from "@/constants/subscriptionPlans";
import useFetch from "@/hooks/useFetch";
import { BadgeVariant, Company } from "@/types";
import { SubscriptionPlan, TransactionType } from "@/types/finance";
import { formatDate } from "@/util";
import { generateEmployersColumns } from "@/components/columns/employersColumns";
import { generateTransactionsColumns } from "@/components/columns/transactionsColumns";
import { formatMoney } from "@/util/general";
import {
  Building2,
  ChevronDown,
  CreditCard,
  DollarSign,
  LayoutList,
  Pen,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";

const statusCards: StatusCardType[] = [
  {
    title: "Total Subscriptions",
    trend: {
      value: "20%",
      trendDirection: "up",
    },
    value: "100",
    icon: (
      <CreditCard className="block h-11 w-11 rounded-full bg-green-100 p-2 text-green-800" />
    ),
  },
  {
    title: "Employers",
    trend: {
      value: "20%",
      trendDirection: "up",
    },
    value: "100",
    icon: (
      <Users className="block h-11 w-11 rounded-full bg-green-100 p-2 text-green-800" />
    ),
  },
  {
    title: "Active Subscribers",
    trend: {
      value: "20%",
      trendDirection: "up",
    },
    value: "60",
    icon: (
      <UserCheck className="block h-11 w-11 rounded-full bg-purple-100 p-2 text-purple-800" />
    ),
  },
  {
    title: "Revenue",
    value: "100$",
    trend: {
      value: "15%",
      trendDirection: "up",
    },
    icon: (
      <DollarSign className="block h-11 w-11 rounded-full bg-green-100 p-2 text-green-800" />
    ),
  },
];

const badgeVariant: Record<string, BadgeVariant> = {
  Free: "neutral",
  Basic: "info",
  Pro: "success",
  Business: "premium",
};

const getPlane = (id: string): SubscriptionPlan => {
  const plan = SUBSCRIPTION_PLANS.find((plan) => plan.id === id);
  if (!plan) return notFound();
  return plan;
};

const planTransactions = (id: string): TransactionType[] => {
  const transactions = TRANSACTIONS.filter(
    (transaction) => transaction.planId === id,
  );
  return transactions;
};

const PlanPage = ({ params: { id } }: { params: { id: string } }) => {
  const [plan, setPlan] = useState(getPlane(id));
  const transactions = planTransactions(id);
  const columns = generateTransactionsColumns();
  const employersColumns = generateEmployersColumns();

  const { data } = useFetch<PaginatedResponse<Company>>(API_GET_COMPANIES+"?limit=100");
  const companies = data?.data || [];

  const updateData = (key: keyof SubscriptionPlan, value: unknown) => {
    setPlan((prevPlan) => ({ ...prevPlan, [key]: value }));
  };

  return (
    <Tabs defaultValue="employers" className="my-8  px-4">
      <Card className="flex w-full items-center justify-between gap-3 space-y-0 p-2">
        <TabsList>
          <TabsTrigger value="employers">
            <LayoutList className="h-5 w-5" />
            Employers
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <Building2 className="h-5 w-5" />
            Transactions
          </TabsTrigger>
        </TabsList>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{plan.name}</CardTitle>
          <CardDescription className="flex gap-4">
            <InfoBlock label="Date" value={formatDate(plan.created_at)} />
            {plan.badge && (
              <InfoBlock
                label="Badge"
                value={
                  <Badge variant={badgeVariant[plan.name]}>{plan.badge}</Badge>
                }
              />
            )}
            <InfoBlock label="Duration" value={plan.duration + " Months"} />
            <InfoBlock
              label="Price"
              value={formatMoney(plan.discountedPrice || 0)}
            />
            <InfoBlock label="Vat" value={plan.vat} />
            <InfoBlock label="Unlocks" value={plan.unlocks} />
            <InfoBlock label="Jobs" value={plan.jobs} />
            <InfoBlock label="Users" value={plan.users} />
            <InfoBlock
              label="Status"
              value={
                <div className="flex items-center gap-2">
                  <Switch
                    id="airplane-mode"
                    checked={plan.status === "active"}
                    onCheckedChange={(value) =>
                      updateData("status", value ? "active" : "inactive")
                    }
                  />
                  <Badge
                    variant={plan.status === "active" ? "success" : "error"}
                  >
                    {plan.status}
                  </Badge>
                </div>
              }
            />
          </CardDescription>
          <CardAction className="inline-flex w-fit">
            <Button
              variant="outline"
              className="rounded-none rounded-s-base border-r-0 shadow-none focus-visible:z-10"
              asChild
            >
              <Link href={`/admin/plans/edit/${plan.id}`}>
                <Pen />
                Edit
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="outline"
                  className="rounded-e-base rounded-s-none focus-visible:z-10"
                >
                  <ChevronDown />
                  <span className="sr-only">Select option</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="bottom"
                sideOffset={4}
                align="end"
                className="md:max-w-xs! max-w-64"
              >
                <DropdownMenuRadioGroup>
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        {statusCards.map((card) => (
          <StatusCard key={card.title} {...card} />
        ))}
      </div>

      <TabsContent value="employers">
        <Card>
          <CardHeader>
            <CardTitle className="mb-3 text-2xl">
              Employers Subscribed to {plan.name}
              <span className="ml-1 text-muted-foreground">
                ({companies.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <AdvancedDataTable
              columns={employersColumns}
              data={companies}
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
      </TabsContent>
      <TabsContent value="transactions">
        <Card>
          <CardHeader>
            <CardTitle className="mb-3 text-2xl">
              All Transactions
              <span className="ml-1 text-muted-foreground">
                ({transactions.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <AdvancedDataTable
              columns={columns}
              data={transactions}
              filters={[
                { key: "created_at" },
                { key: "total_amount", className: "max-w-38" },
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
      </TabsContent>
    </Tabs>
  );
};

export default PlanPage;
