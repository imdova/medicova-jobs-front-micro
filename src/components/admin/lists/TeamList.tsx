"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAdmins, updateAdminProfile } from "@/store/slices/admins.slice";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/UI/card";
import AdvancedDataTable from "@/components/UI/AdvancedDataTable";
import { Separator } from "@/components/UI/separator";
import {
  ActionsType,
  generateEmployeesColumns,
} from "@/components/columns/employeesColumns";
import { Button } from "@/components/UI/button";
import { Plus } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";
import { AdminUser } from "@/types/admin";
import {
  AddNewEmployeeDialog,
  AddNewEmployeeForm,
} from "../forms/AddNewEmployee";
import { AssignCompany } from "../forms/assign-company";
import { AssignAdmins } from "../forms/assign-admins";
import { User } from "next-auth";
import { fetchCompanies } from "@/store/slices/companies.slice";

const TeamList = ({ user }: { user: User }) => {
  const dispatch = useAppDispatch();
  const { departments } = usePermissions();
  const { data: admins } = useAppSelector((state) => state.admins);
  const { data: companies } = useAppSelector((state) => state.companies);

  const [action, setAction] = useState<ActionsType | null>(null);
  const [adminId, setActiveAdmin] = useState<string | null>(null);

  const activeAdmin = admins?.find((admin) => admin.id === adminId);

  const onClose = () => {
    setAction(null);
    setActiveAdmin(null);
  };

  const actionHandler = (row: AdminUser, action: ActionsType) => {
    setAction(action);
    setActiveAdmin(row.id);
  };

  const columns = generateEmployeesColumns(
    companies || [],
    admins || [],
    departments || [],
    actionHandler,
    user,
  );

  const updateData = (
    rowIndex: number,
    columnId: string,
    value: string | number | boolean,
  ) => {
    dispatch(
      updateAdminProfile({
        id: admins[rowIndex].id,
        updates: {
          [columnId]: value,
        },
      }),
    );
  };

  useEffect(() => {
    dispatch(fetchAdmins({ filter: { type: "" }, user }));
    dispatch(fetchCompanies({ limit: 1000, page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <>
      {adminId && (
        <AddNewEmployeeForm
          open={action === "edit"}
          setOpen={onClose}
          defaultValues={activeAdmin}
          user={user}
        />
      )}
      {activeAdmin && action === "assign-companies" && (
        <AssignCompany
          userId={user?.id || ""}
          open={action === "assign-companies"}
          setOpen={onClose}
          defaultValues={activeAdmin}
        />
      )}
      {activeAdmin && action === "assign-admins" && (
        <AssignAdmins
          userId={user?.id || ""}
          open={action === "assign-admins"}
          setOpen={onClose}
          defaultValues={activeAdmin}
        />
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Employees
            <span className="text-muted-foreground self-end text-sm">
              ({admins.length})
            </span>
          </CardTitle>
          <CardDescription>You can manage employees here.</CardDescription>
          <CardAction>
            <AddNewEmployeeDialog user={user}>
              <Button variant="outline">
                <Plus />
                Add New Employee
              </Button>
            </AddNewEmployeeDialog>
          </CardAction>
        </CardHeader>
        <Separator className="my-2" />
        <CardContent className="p-0">
          <AdvancedDataTable
            name="medicova-employees"
            columns={columns}
            data={admins}
            updateData={updateData}
            hideSearch={false}
            hideColumnManager={false}
            hideExport={false}
            hidePagination={false}
            filters={[
              { key: "type", className: "max-w-44" },
              { key: "departmentId", className: "max-w-44" },
            ]}
            defaultSorting={{
              id: "firstName",
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
          />
        </CardContent>
      </Card>
    </>
  );
};

export default TeamList;
