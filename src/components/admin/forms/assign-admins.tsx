import { AdminUser } from "@/types/admin";
import { useEffect, useState } from "react";
import { DialogClose, DialogFooter } from "@/components/UI/dialog";
import { Button } from "@/components/UI/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/UI/sheet";
import { Separator } from "@/components/UI/separator";
import AdvancedDataTable from "@/components/UI/AdvancedDataTable";
import { RowSelectionState } from "@tanstack/react-table";

import Loading from "@/components/loading/loading";
import {
  AssignAdminsFormValues,
  assignAdminsToAdmin,
  fetchAssignedAdmins,
} from "@/store/slices/admins.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { generateEmployeesColumns } from "@/components/columns/employeesColumns";
import { usePermissions } from "@/hooks/usePermissions";

// types
interface AssignAdminsProps {
  defaultValues: AdminUser;
  userId: string;
  children?: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}

// configs
function mapDataByIds(
  admins: { id: string }[],
  ids: string[],
): Record<string, true> {
  const result: Record<string, true> = {};
  const idToIndex = new Map(admins.map((c, index) => [c.id, index]));

  for (const id of ids) {
    const index = idToIndex.get(id);
    if (index !== undefined) {
      result[index] = true;
    }
  }

  return result;
}

function getSelectedData<T>(data: T[], rowSelection: RowSelectionState): T[] {
  return Object.keys(rowSelection)
    .filter((key) => rowSelection[key]) // keep only `true` selected keys
    .map((key) => data[Number(key)]) // rowId is the index by default
    .filter((item): item is T => item !== undefined);
}

export const AssignAdmins: React.FC<AssignAdminsProps> = ({
  userId,
  defaultValues: initialValues,
  open,
  setOpen,
  children,
}) => {
  // radux hooks
  const dispatch = useAppDispatch();
  const { loading, fetchingAssignedAdmins } = useAppSelector(
    (state) => state.admins,
  );
  const { data: admins } = useAppSelector((state) => state.admins);
  const { departments } = usePermissions();

  const selected = mapDataByIds(admins, initialValues?.adminIds || []);
  // local states
  const [selection, setSelection] = useState<RowSelectionState>(selected);
  const adminsColumns = generateEmployeesColumns(
    [],
    [],
    departments,
    undefined,
    undefined,
  );
  // functions
  async function onSubmit() {
    const selectedData = getSelectedData(admins || [], selection);
    const adminsIds = selectedData.map((company) => company.id);
    const body: AssignAdminsFormValues = {
      actorId: userId,
      adminId: initialValues?.id,
      usersIds: adminsIds,
      oldUsersIds: initialValues?.adminIds || [],
    };
    dispatch(assignAdminsToAdmin(body));
    onOpenChange(false);
  }

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setSelection({});
    }
    setOpen(open);
  };
  /// after couple oif times the adminsIds array return to empty array
  useEffect(() => {
    if (initialValues?.adminIds === undefined) {
      dispatch(
        fetchAssignedAdmins({
          adminId: initialValues?.id,
          actorId: userId,
        }),
      )
        .unwrap()
        .then((data) => {
          setSelection(
            mapDataByIds(
              admins,
              data.map((c) => c.id),
            ),
          );
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {children && <SheetTrigger asChild>{children}</SheetTrigger>}
      <SheetContent className="sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle className="text-xl">
            Assign Companies to {initialValues?.firstName}{" "}
            {initialValues?.lastName}
          </SheetTitle>
          <SheetDescription>
            you can assign multiple admins to this employee select the admins
            you want to assign
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="flex flex-col gap-6 overflow-y-auto rounded-lg">
          {fetchingAssignedAdmins ? (
            <Loading className="flex h-full min-h-[80vh] w-full items-center justify-center" />
          ) : (
            <AdvancedDataTable
              name="admins"
              columns={adminsColumns}
              selection={selection}
              setSelection={setSelection}
              defaultColumnVisibility={{
                email: false,
                companyIds: false,
                adminIds: false,
                rolesIds: false,
                active: false,
                actions: false,
              }}
              data={admins}
              defaultSorting={{
                id: "name",
                desc: false,
              }}
              hideSearch={false}
              cellClassName="text-xs"
              headerClassName="text-xs"
              tableClassName="text-xs rounded-0"
              filters={[
                {
                  key: "created_at",
                },
                {
                  key: "departmentId",
                },
                {
                  key: "type",
                },
              ]}
              initialPagination={{
                pageIndex: 0,
                pageSize: 100,
              }}
            />
          )}
          <DialogFooter className="sticky bottom-0 border-t bg-white p-5">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={onSubmit} disabled={loading}>
              {loading ? "Loading..." : `Assign Admins`}
            </Button>
          </DialogFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};
