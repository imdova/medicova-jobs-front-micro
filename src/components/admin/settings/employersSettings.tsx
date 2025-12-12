"use client";

import React, { useState } from "react";
import { CircularProgress, IconButton, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import { Building2, ChevronDown, Edit, FolderOpen, Trash2 } from "lucide-react";
import useUpdateApi from "@/hooks/useUpdateApi";
import {
  API_CREATE_COMPANY_SECTOR,
  API_CREATE_COMPANY_TYPE,
  API_DELETE_COMPANY_SECTOR,
  API_DELETE_COMPANY_TYPE,
  API_UPDATE_COMPANY_SECTOR,
  API_UPDATE_COMPANY_TYPE,
} from "@/api/admin";
import { FieldConfig, Industry } from "@/types";
import FormModal from "@/components/form/FormModal/FormModal";
import DeleteConfirmationDialog from "@/components/UI/DeleteConfirmationDialog";
import { useSectorsData } from "@/hooks/useSectorsData";

const EmployersSettings: React.FC = () => {
  const [sectorId, setSector] = useState("");
  const { sectors, types, refresh } = useSectorsData({ sectorId });

  const { update } = useUpdateApi();

  const [isShake, setIsShake] = useState<string | null>(null);

  const [newSector, setNewSector] = useState("");

  const [newItem, setNewItem] = useState<{
    value?: string;
    method: "POST" | "PATCH";
    url: string;
    body?: any;
    getBody?: (data: Industry) => any;
    data?: any;
    fields: FieldConfig[];
    type?: string;
  } | null>();

  const [deleteItem, setDeleteItem] = useState<{
    url: string;
    item: Industry;
  } | null>();

  const formHandling = async ({
    body,
    data,
    url,
    method,
  }: {
    body?: any;
    data?: Industry[];
    url: string;
    method: "POST" | "PATCH" | "DELETE";
  }) => {
    const isDuplicated = data?.find((item) => item.name === body?.name);
    if (isDuplicated) {
      return shake(isDuplicated.id);
    }
    console.log("🚀 ~ url, { method, body }:", url, { method, body });
    await update(url, { method, body });
    refresh();
    setNewItem(null);
  };

  function shake(name: string) {
    setIsShake(name);
    setTimeout(() => {
      setIsShake(null);
    }, 500);
  }
  const onSubmit = (formData: Industry) => {
    if (newItem) {
      const body = newItem.getBody
        ? newItem.getBody(formData)
        : {
            ...newItem.body,
            ...formData,
          };
      formHandling({
        method: newItem.method,
        url: newItem.url,
        body: body,
      });
    }
  };
  const handleDelete = () => {
    if (deleteItem) {
      formHandling({
        method: "DELETE",
        url: deleteItem.url,
      });
      setDeleteItem(null);
    }
  };

  const defaultField: FieldConfig = {
    name: "name",
    label: "Name",
    type: "text",
  };

  return (
    <div>
      {deleteItem && (
        <DeleteConfirmationDialog
          open={Boolean(deleteItem)}
          title="Confirm Deletion"
          hardDeleteText={`Delete ${deleteItem.item.name}`
            .trim()
            .toUpperCase()
            .replaceAll(" ", "-")}
          message={`Are you sure you want to delete "${deleteItem.item.name}"? This action cannot be undone. Deleting this can effect any job or seeker that use this data `}
          onDelete={handleDelete}
          onClose={() => setDeleteItem(null)}
        />
      )}

      {newItem && (
        <FormModal
          open={Boolean(newItem)}
          onClose={() => setNewItem(null)}
          onSubmit={onSubmit}
          fields={[defaultField, ...newItem.fields]}
          title={
            newItem.method === "POST"
              ? `Create ${newItem.type}`
              : `Update ${newItem.type}`
          }
          initialValues={newItem.data}
        />
      )}

      <div className="space-y-2 rounded-base border border-gray-200 p-4 shadow-soft">
        <div className="mb-4 flex justify-between">
          <h2 className="text-3xl font-semibold">Company Sectors & types </h2>

          <TextField
            value={newSector}
            onChange={(e) => setNewSector(e.target.value)}
            className="m-0"
            variant="outlined"
            placeholder={"Add New Sector"}
            disabled={sectors.loading} // Disable if 12 skills are reached
            InputProps={{
              className: "p-0",
              endAdornment: (
                <IconButton
                  onClick={() =>
                    formHandling({
                      body: { name: newSector },
                      data: sectors.data?.data,
                      method: "POST",
                      url: API_CREATE_COMPANY_SECTOR,
                    })
                  }
                  className="flex h-full w-[42px] items-center justify-center rounded-base"
                  type="submit"
                >
                  <Add />
                </IconButton>
              ),
            }}
          />
        </div>
        {sectors.data?.data.map((sector) => (
          <div key={sector.id} className="space-y-2">
            <div className="flex justify-between rounded-base border border-gray-200 p-3 px-5 shadow-soft">
              <div className="flex items-center gap-2">
                {/* <DragIndicator className="h-4 w-4 cursor-move text-gray-400" /> */}
                <button
                  onClick={() =>
                    setSector(sectorId === sector.id ? "" : sector.id)
                  }
                  className={`rounded-full p-2 duration-300 hover:bg-gray-50 ${sectorId === sector.id ? "rotate-180" : ""}`}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <Building2 className="h-4 w-4 text-violet-500" />
                <span
                  className={
                    isShake === sector.id ? "animate-shake text-red-500" : ""
                  }
                >
                  {sector.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setNewItem({
                      fields: [],
                      data: { sectorId: sector.id },
                      url: API_CREATE_COMPANY_TYPE,
                      method: "POST",
                      type: "Company Type",
                    })
                  }
                  className="flex items-center gap-2"
                >
                  <Add className="h-4 w-4" />
                  <span className="text-sm">Add Type</span>
                </button>
                <button
                  onClick={() =>
                    setNewItem({
                      fields: [],
                      data: sector,
                      url: API_UPDATE_COMPANY_SECTOR,
                      method: "PATCH",
                      type: "Company Sector",
                    })
                  }
                  className="rounded-full bg-gray-200 p-2 hover:bg-blue-100"
                >
                  <Edit className="h-4 w-4 text-gray-500 hover:text-blue-500" />
                </button>

                <button
                  onClick={() =>
                    setDeleteItem({
                      item: sector,
                      url: API_DELETE_COMPANY_SECTOR + sector.id,
                    })
                  }
                  className="rounded-full bg-gray-200 p-2 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                </button>
              </div>
            </div>
            {sectorId === sector.id ? (
              types.loading ? (
                <div className="flex h-24 items-center justify-center">
                  <CircularProgress />
                  <h6 className="ml-4">Loading...</h6>
                </div>
              ) : types.data?.data.length === 0 ? (
                <div className="flex h-24 items-center justify-center">
                  <p>No Company Types Found for this Sector</p>
                </div>
              ) : (
                types.data?.data.map((type) => (
                  <div key={type.id} className="ml-6 space-y-2">
                    <div className="flex justify-between rounded-base border border-gray-200 p-3 px-5 shadow-soft">
                      <div className="flex items-center gap-2">
                        <FolderOpen className="h-4 w-4 text-orange-500" />
                        {type.name}
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setNewItem({
                              fields: [],
                              data: { ...type, sectorId: sector.id },
                              url: API_UPDATE_COMPANY_TYPE,
                              method: "PATCH",
                              type: "Company Type",
                            })
                          }
                          className="rounded-full bg-gray-200 p-2 hover:bg-blue-100"
                        >
                          <Edit className="h-4 w-4 text-gray-500 hover:text-blue-500" />
                        </button>

                        <button
                          onClick={() =>
                            setDeleteItem({
                              item: type,
                              url: API_DELETE_COMPANY_TYPE + type.id,
                            })
                          }
                          className="rounded-full bg-gray-200 p-2 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployersSettings;
