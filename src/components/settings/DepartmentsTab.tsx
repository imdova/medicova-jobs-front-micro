"use client";
import React, { useEffect } from "react";
import { Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDepartments } from "@/store/slices/departments.slice";
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
import {
  getDepartmentsColumns,
  DepartMentDialogForm,
} from "@/components/columns/departmentColumns";

const DepartmentTab: React.FC = () => {
  const { data: departments } = useAppSelector((state) => state.departments);
  const dispatch = useAppDispatch();
  const columns = getDepartmentsColumns();

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  return (
    <div className="space-y-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Departments
            <span className="text-muted-foreground self-end text-sm">
              ({departments.length})
            </span>
          </CardTitle>
          <CardDescription>You can manage departments here.</CardDescription>
          <CardAction>
            <DepartMentDialogForm>
              <Button variant="outline">
                <Plus />
                Add New Department
              </Button>
            </DepartMentDialogForm>
          </CardAction>
        </CardHeader>
        <Separator className="my-2" />
        <CardContent className="p-0">
          <AdvancedDataTable
            name="medicova-departments"
            columns={columns}
            data={departments}
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

export default DepartmentTab;
