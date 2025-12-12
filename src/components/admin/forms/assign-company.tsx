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
import { generateEmployersColumns } from "@/components/columns/employersColumns";
import { RowSelectionState } from "@tanstack/react-table";

import Loading from "@/components/loading/loading";
import {
  assignCompaniesToAdmin,
  AssignCompanyFormValues,
  fetchAssignedCompanies,
} from "@/store/slices/admins.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

// types
interface AssignCompanyProps {
  defaultValues: AdminUser;
  userId: string;
  children?: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}

// configs
function mapCompaniesByIds(
  companies: { id: string }[],
  ids: string[],
): Record<string, true> {
  const result: Record<string, true> = {};
  const idToIndex = new Map(companies.map((c, index) => [c.id, index]));

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

export const AssignCompany: React.FC<AssignCompanyProps> = ({
  userId,
  defaultValues: initialValues,
  open,
  setOpen,
  children,
}) => {
  // radux hooks
  const dispatch = useAppDispatch();
  const { loading, fetchingAssignedCompanies } = useAppSelector(
    (state) => state.admins,
  );
  const { data: companies } = useAppSelector((state) => state.companies);

  const selected = mapCompaniesByIds(
    companies,
    initialValues?.companyIds || [],
  );
  // local states
  const [selection, setSelection] = useState<RowSelectionState>(selected);
  const employersColumns = generateEmployersColumns();

  // functions
  async function onSubmit() {
    const selectedData = getSelectedData(companies || [], selection);
    const companiesIds = selectedData.map((company) => company.id);
    const body: AssignCompanyFormValues = {
      actorId: userId,
      adminId: initialValues?.id,
      companiesIds: companiesIds,
      oldCompaniesIds: initialValues?.companyIds || [],
    };
    dispatch(assignCompaniesToAdmin(body));
    onOpenChange(false);
  }

  const onOpenChange = (open: boolean) => {
    if (!open) {
      setSelection({});
    }
    setOpen(open);
  };
  /// after couple oif times the companiesIds array return to empty array
  useEffect(() => {
    if (initialValues?.companyIds === undefined) {
      dispatch(
        fetchAssignedCompanies({
          adminId: initialValues?.id,
          actorId: userId,
        }),
      )
        .unwrap()
        .then((data) => {
          setSelection(
            mapCompaniesByIds(
              companies,
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
            you can assign multiple companies to this employee select the
            companies you want to assign
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="flex flex-col gap-6 overflow-y-auto rounded-lg">
          {fetchingAssignedCompanies ? (
            <Loading className="flex h-full min-h-[80vh] w-full items-center justify-center" />
          ) : (
            <AdvancedDataTable
              name="companies"
              columns={employersColumns}
              selection={selection}
              setSelection={setSelection}
              defaultColumnVisibility={{
                accountManager: false,
                username: false,
                created_at: false,
                hidden: false,
                state: false,
                city: false,
                size: false,
                title: false,
                companyTypeName: false,
                phone: false,
                email: false,
              }}
              data={companies}
              defaultSorting={{
                id: "name",
                desc: false,
              }}
              hideSearch={false}
              cellClassName="text-xs"
              headerClassName="text-xs"
              tableClassName="text-xs rounded-0"
              hideColumnManager={false}
              filters={[
                {
                  key: "created_at",
                },
                {
                  key: "completencePercent",
                  className: "max-w-32",
                },
                {
                  key: "country",
                  className: "min-w-32",
                },
                {
                  key: "state",
                  className: "min-w-32",
                },
                {
                  key: "city",
                  className: "max-w-32",
                },
                {
                  key: "size",
                },
                {
                  key: "companyTypeName",
                },
                {
                  key: "companySectorName",
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
              {loading ? "Loading..." : "Assign"}
            </Button>
          </DialogFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};
