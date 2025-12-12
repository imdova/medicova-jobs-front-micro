"use client";

import React, { useState } from "react";
import { CircularProgress, IconButton, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useIndustriesData } from "@/hooks/useIndustriesData";
import {
  Building2,
  ChevronDown,
  Edit,
  FolderOpen,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";
import useUpdateApi from "@/hooks/useUpdateApi";
import {
  API_CREATE_CAREER_LEVEL,
  API_CREATE_CATEGORY,
  API_CREATE_EMPLOYMENT_TYPE,
  API_CREATE_INDUSTRY,
  API_CREATE_SPECIALITY,
  API_DELETE_CAREER_LEVEL,
  API_DELETE_CATEGORY,
  API_DELETE_EMPLOYMENT_TYPE,
  API_DELETE_INDUSTRY,
  API_DELETE_SPECIALITY,
  API_UPDATE_CATEGORY,
  API_UPDATE_EMPLOYMENT_TYPE,
  API_UPDATE_INDUSTRY,
  API_UPDATE_SPECIALITY,
} from "@/api/admin";
import { FieldConfig, Industry } from "@/types";
import FormModal from "@/components/form/FormModal/FormModal";
import DeleteConfirmationDialog from "@/components/UI/DeleteConfirmationDialog";

const JobsSettings: React.FC = () => {
  const [industryId, setIndustryId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [view, setView] = useState<"specialty" | "level" | null>(null);

  const {
    categories,
    specialities,
    careerLevels,
    industries,
    employmentTypes,
    refresh,
  } = useIndustriesData({ industryId, categoryId });
  const { update } = useUpdateApi();

  const [isShake, setIsShake] = useState<string | null>(null);

  const [newIndustry, setNewIndustry] = useState("");
  const [newEmployment, setEmployment] = useState("");

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
    setNewIndustry("");
    setEmployment("");
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
          <h2 className="text-3xl font-semibold">Industries </h2>

          <TextField
            value={newIndustry}
            onChange={(e) => setNewIndustry(e.target.value)}
            className="m-0"
            variant="outlined"
            placeholder={"Add New Industry"}
            disabled={industries.loading} // Disable if 12 skills are reached
            InputProps={{
              className: "p-0",
              endAdornment: (
                <IconButton
                  onClick={() =>
                    formHandling({
                      body: { name: newIndustry },
                      data: industries.data?.data,
                      method: "POST",
                      url: API_CREATE_INDUSTRY,
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
        {industries.data?.data.map((industry) => (
          <div key={industry.id} className="space-y-2">
            <div className="flex justify-between rounded-base border border-gray-200 p-3 px-5 shadow-soft">
              <div className="flex items-center gap-2">
                {/* <DragIndicator className="h-4 w-4 cursor-move text-gray-400" /> */}
                <button
                  onClick={() =>
                    setIndustryId(industryId === industry.id ? "" : industry.id)
                  }
                  className={`rounded-full p-2 duration-300 hover:bg-gray-50 ${industryId === industry.id ? "rotate-180" : ""}`}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <Building2 className="h-4 w-4 text-violet-500" />
                <span
                  className={
                    isShake === industry.id ? "animate-shake text-red-500" : ""
                  }
                >
                  {industry.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setNewItem({
                      fields: [
                        {
                          name: "industries",
                          type: "radio",
                          multiple: true,
                          label: "Industries Parents",
                          options: industries?.data?.data.map((industry) => ({
                            label: industry.name,
                            value: industry.id,
                          })),
                          required: true,
                        },
                      ],
                      data: { industries: [industry.id] },
                      url: API_CREATE_CATEGORY,
                      method: "POST",
                      type: "Category",
                    })
                  }
                  className="flex items-center gap-2"
                >
                  <Add className="h-4 w-4" />
                  <span className="text-sm">Add Category</span>
                </button>
                <button
                  onClick={() =>
                    setNewItem({
                      fields: [],
                      data: industry,
                      url: API_UPDATE_INDUSTRY,
                      method: "PATCH",
                      type: "Industry",
                    })
                  }
                  className="rounded-full bg-gray-200 p-2 hover:bg-blue-100"
                >
                  <Edit className="h-4 w-4 text-gray-500 hover:text-blue-500" />
                </button>

                <button
                  onClick={() =>
                    setDeleteItem({
                      item: industry,
                      url: API_DELETE_INDUSTRY + industry.id,
                    })
                  }
                  className="rounded-full bg-gray-200 p-2 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                </button>
              </div>
            </div>
            {industryId === industry.id ? (
              categories.loading ? (
                <div className="flex h-24 items-center justify-center">
                  <CircularProgress />
                  <h6 className="ml-4">Loading...</h6>
                </div>
              ) : categories.data?.data.length === 0 ? (
                <div className="flex h-24 items-center justify-center">
                  <p>No Categories Found for this Industry</p>
                </div>
              ) : (
                categories.data?.data.map((category) => (
                  <div key={category.id} className="ml-6 space-y-2">
                    <div className="flex justify-between rounded-base border border-gray-200 p-3 px-5 shadow-soft">
                      <div className="flex items-center gap-2">
                        {/* <DragIndicator className="h-4 w-4 cursor-move text-gray-400" /> */}

                        <button
                          onClick={() =>
                            setCategoryId(
                              categoryId === category.id ? "" : category.id,
                            )
                          }
                          className={`rounded-full p-2 duration-300 hover:bg-gray-50 ${categoryId === category.id ? "rotate-180" : ""}`}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <FolderOpen className="h-4 w-4 text-orange-500" />
                        {category.name}
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setNewItem({
                              fields: [],
                              data: category,
                              url: API_UPDATE_CATEGORY,
                              method: "PATCH",
                              type: "Category",
                            })
                          }
                          className="rounded-full bg-gray-200 p-2 hover:bg-blue-100"
                        >
                          <Edit className="h-4 w-4 text-gray-500 hover:text-blue-500" />
                        </button>

                        <button
                          onClick={() =>
                            setDeleteItem({
                              item: category,
                              url: API_DELETE_CATEGORY + category.id,
                            })
                          }
                          className="rounded-full bg-gray-200 p-2 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                    {categoryId === category.id && (
                      <div className="ml-6 space-y-2">
                        <div className="flex justify-between rounded-base border border-gray-200 p-3 px-5 shadow-soft">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                setView(
                                  view === "specialty" ? null : "specialty",
                                )
                              }
                              className={`rounded-full p-2 duration-300 hover:bg-gray-50 ${view === "specialty" ? "rotate-180" : ""}`}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                            <Star className="h-4 w-4 text-yellow-500" />
                            specialties
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                setNewItem({
                                  fields: [],
                                  getBody: (data) => ({
                                    name: [data.name],
                                    categoryId: category.id,
                                  }),
                                  url: API_CREATE_SPECIALITY,
                                  method: "POST",
                                  type: "Specialty",
                                })
                              }
                              className="flex items-center gap-2"
                            >
                              <Add className="h-4 w-4" />
                              <span className="text-sm">Add Specialty</span>
                            </button>
                          </div>
                        </div>
                        {view === "specialty" ? (
                          specialities.data?.data.length === 0 ? (
                            <div className="flex h-24 items-center justify-center">
                              <p>No Specialties Found for this Category</p>
                            </div>
                          ) : (
                            specialities.data?.data.map((specialty) => (
                              <div key={specialty.id}>
                                <div className="ml-6 flex justify-between rounded-base border border-gray-200 p-3 px-5 shadow-soft">
                                  <div className="flex items-center gap-2">
                                    {/* <DragIndicator className="h-4 w-4 cursor-move text-gray-400" /> */}
                                    <Star className="h-4 w-4 text-yellow-500" />
                                    {specialty.name}
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={() =>
                                        setNewItem({
                                          fields: [],
                                          getBody: (data) => ({
                                            id: specialty.id,
                                            name: [data.name],
                                            categoryId: category.id,
                                          }),
                                          data: specialty,
                                          url: API_UPDATE_SPECIALITY,
                                          method: "PATCH",
                                          type: "Specialty",
                                        })
                                      }
                                      className="rounded-full bg-gray-200 p-2 hover:bg-blue-100"
                                    >
                                      <Edit className="h-4 w-4 text-gray-500 hover:text-blue-500" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        setDeleteItem({
                                          item: specialty,
                                          url:
                                            API_DELETE_SPECIALITY +
                                            specialty.id,
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
                    )}
                    {categoryId === category.id && (
                      <div className="ml-6 space-y-2">
                        <div className="flex justify-between rounded-base border border-gray-200 p-3 px-5 shadow-soft">
                          <div className="flex items-center gap-2">
                            {/* <DragIndicator className="h-4 w-4 cursor-move text-gray-400" /> */}
                            <button
                              onClick={() =>
                                setView(view === "level" ? null : "level")
                              }
                              className={`rounded-full p-2 duration-300 hover:bg-gray-50 ${view === "level" ? "rotate-180" : ""}`}
                            >
                              <ChevronDown className="h-4 w-4" />
                            </button>
                            <TrendingUp className="h-4 w-4 text-primary" />
                            Career Levels
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                setNewItem({
                                  fields: [
                                    {
                                      name: "categoriesIds",
                                      type: "radio",
                                      multiple: true,
                                      label: "Categories Parents",
                                      options: categories?.data?.data.map(
                                        (catG) => ({
                                          label: catG.name,
                                          value: catG.id,
                                        }),
                                      ),
                                      required: true,
                                    },
                                  ],
                                  url: API_CREATE_CAREER_LEVEL,
                                  method: "POST",
                                  type: "Specialty",
                                })
                              }
                              className="flex items-center gap-2"
                            >
                              <Add className="h-4 w-4" />
                              <span className="text-sm">Add Career Level</span>
                            </button>
                          </div>
                        </div>
                        {view === "level" ? (
                          careerLevels.data?.data.length === 0 ? (
                            <div className="flex h-24 items-center justify-center">
                              <p>No Career Levels Found for this Category</p>
                            </div>
                          ) : (
                            careerLevels.data?.data.map((level) => (
                              <div key={level.id}>
                                <div className="ml-6 flex justify-between rounded-base border border-gray-200 p-3 px-5 shadow-soft">
                                  <div className="flex items-center gap-2">
                                    {/* <DragIndicator className="h-4 w-4 cursor-move text-gray-400" /> */}
                                    <TrendingUp className="h-4 w-4" />
                                    {level.name}
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={() =>
                                        setNewItem({
                                          fields: [],
                                          data: level,
                                          url: API_CREATE_CAREER_LEVEL,
                                          method: "PATCH",
                                          type: "Specialty",
                                        })
                                      }
                                      className="rounded-full bg-gray-200 p-2 hover:bg-blue-100"
                                    >
                                      <Edit className="h-4 w-4 text-gray-500 hover:text-blue-500" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        setDeleteItem({
                                          item: level,
                                          url:
                                            API_DELETE_CAREER_LEVEL + level.id,
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
                    )}
                  </div>
                ))
              )
            ) : null}
          </div>
        ))}
      </div>

      <div className="space-y-2 mt-6 rounded-base border border-gray-200 p-4 shadow-soft">
        <div className="mb-4 flex justify-between">
          <h2 className="text-3xl font-semibold">Employment Types </h2>

          <TextField
            value={newEmployment}
            onChange={(e) => setEmployment(e.target.value)}
            className="m-0"
            variant="outlined"
            placeholder={"Add New Employment Type"}
            disabled={employmentTypes.loading} // Disable if 12 skills are reached
            InputProps={{
              className: "p-0",
              endAdornment: (
                <IconButton
                  onClick={() =>
                    formHandling({
                      body: { name: newEmployment },
                      data: employmentTypes.data?.data,
                      method: "POST",
                      url: API_CREATE_EMPLOYMENT_TYPE,
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
        {employmentTypes.data?.data.map((type) => (
          <div key={type.id} className="space-y-2">
            <div className="flex justify-between rounded-base border border-gray-200 p-3 px-5 shadow-soft">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-violet-500" />
                <span
                  className={
                    isShake === type.id ? "animate-shake text-red-500" : ""
                  }
                >
                  {type.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setNewItem({
                      fields: [],
                      data: type,
                      url: API_UPDATE_EMPLOYMENT_TYPE,
                      method: "PATCH",
                      type: "Employment Type",
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
                      url: API_DELETE_EMPLOYMENT_TYPE + type.id,
                    })
                  }
                  className="rounded-full bg-gray-200 p-2 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsSettings;
