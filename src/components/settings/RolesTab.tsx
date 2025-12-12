"use client";
import React, { useEffect } from "react";
import { Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
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
import { Button } from "../UI/button";
import { getRolesColumns, RoleDialogForm } from "../columns/rolesColumns";
import { fetchRolesByUserType } from "@/store/slices/roles.slice";

const RolesTab: React.FC = () => {
  const { data: roles } = useAppSelector((state) => state.roles);
  const dispatch = useAppDispatch();
  const columns = getRolesColumns();

  useEffect(() => {
    dispatch(fetchRolesByUserType({ userType: "admin" }));
  }, [dispatch]);

  return (
    <div className="space-y-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Roles
            <span className="text-muted-foreground self-end text-sm">
              ({roles.length})
            </span>
          </CardTitle>
          <CardDescription>You can manage roles here.</CardDescription>
          <CardAction>
            <RoleDialogForm>
              <Button variant="outline">
                <Plus />
                Add New Role
              </Button>
            </RoleDialogForm>
          </CardAction>
        </CardHeader>
        <Separator className="my-2" />
        <CardContent className="p-0">
          <AdvancedDataTable
            name="medicova-roles"
            columns={columns}
            data={roles}
            hideSearch={false}
            hideExport={false}
            hidePagination={false}
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
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RolesTab;
