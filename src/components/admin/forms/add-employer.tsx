"use client";
import { API_GET_COMPANY_SECTORS, API_GET_COMPANY_TYPES } from "@/api/admin";
import PhoneNumberInput from "@/components/UI/phoneNumber";
import useFetch from "@/hooks/useFetch";
import { useLocationData } from "@/hooks/useLocationData";
import { Sector } from "@/types";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Globe, Link2, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

interface SocialLink {
  platform: string;
  url: string;
}

// Define the form data types based on company structure
interface CompanyFormData {
  name: string;
  title: string;
  email: string;
  avatar: string | File;
  phone: string;
  country: {
    code: string;
    name: string;
  };
  state: {
    code: string;
    name: string;
  };
  city: string;
  size: string;
  companyTypeId: string;
  companyTypeName: string;
  companySectorId: string;
  companySectorName: string;
  about?: string;
  yearFounded?: number;
  isProfitable?: boolean;
  status?: string;
  socialLinks: SocialLink[];
}

// Assume this function will call the API
// TODO-API: API_CREATE_COMPANY
const submitFormData = async (data: CompanyFormData) => {
  const response = await fetch("API_CREATE_COMPANY", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
};

interface AddNewEmployerProps {
  handleCloseModal: () => void;
  isModalOpen: boolean;
}

const AddNewEmployer: React.FC<AddNewEmployerProps> = ({
  handleCloseModal,
  isModalOpen,
}) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm<CompanyFormData>({
    defaultValues: {
      country: { code: "", name: "" },
      state: { code: "", name: "" },
      socialLinks: [{ platform: "", url: "" }],
    },
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // types countries data
  const { countries } = useLocationData();
  const country = watch("country");
  const countryCode = country?.code;
  const { states } = useLocationData(countryCode || "");
  // types sectors data
  const { data: sectors } = useFetch<PaginatedResponse<Sector>>(
    API_GET_COMPANY_SECTORS,
  );
  // types company data
  const { data: types } = useFetch<PaginatedResponse<Sector>>(
    API_GET_COMPANY_TYPES,
  );

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create a preview URL for the image
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setValue("avatar", file);
    }
  };

  const handleDeleteImage = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
      setPreviewImage(null);
      // Clear the file input
      const fileInput = document.getElementById(
        "dropzone-file",
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  // Watch sector and type selections to set names
  const sectorId = watch("companySectorId");
  const typeId = watch("companyTypeId");
  const socialLinks = watch("socialLinks") || [];

  useEffect(() => {
    if (sectorId && sectors?.data) {
      const selectedSector = sectors.data.find((s) => s.id === sectorId);
      if (selectedSector) {
        setValue("companySectorName", selectedSector.name);
      }
    }
  }, [sectorId, sectors, setValue]);

  useEffect(() => {
    if (typeId && types?.data) {
      const selectedType = types.data.find((t) => t.id === typeId);
      if (selectedType) {
        setValue("companyTypeName", selectedType.name);
      }
    }
  }, [typeId, types, setValue]);

  const handleAddSocialLink = () => {
    setValue("socialLinks", [...socialLinks, { platform: "", url: "" }]);
  };

  const handleRemoveSocialLink = (index: number) => {
    const newLinks = [...socialLinks];
    newLinks.splice(index, 1);
    setValue("socialLinks", newLinks);
  };

  const handleSocialLinkChange = (
    index: number,
    field: keyof SocialLink,
    value: string,
  ) => {
    const newLinks = [...socialLinks];
    newLinks[index][field] = value;
    setValue("socialLinks", newLinks);
  };

  const onSubmit: SubmitHandler<CompanyFormData> = async (
    data: CompanyFormData,
  ) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await submitFormData({
        ...data,
        status: "inactive", // Default status
        size: data.size || "micro", // Default size
      });
      if (response.error) {
        setErrorMessage(response.error);
      } else {
        alert("Company created successfully!");
        handleCloseModal();
      }
      console.log(data);
    } catch (error) {
      setErrorMessage(
        "There was an error processing your request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isModalOpen}
      onClose={handleCloseModal}
      fullWidth
      maxWidth="sm"
    >
      <Typography
        className="border-primary text-primary m-3 w-fit border-b-2 p-3"
        variant="h6"
        gutterBottom
      >
        Add New Company
      </Typography>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-5 flex flex-col items-center gap-3 border-b border-gray-200 pb-5 md:flex-row">
            <div className="group w-full md:w-fit">
              {previewImage ? (
                <div className="relative h-full w-full">
                  <Image
                    width={200}
                    height={200}
                    src={previewImage}
                    alt="Preview"
                    className="max-h-[200px] w-[200px] max-w-[200px] rounded-xl object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteImage();
                    }}
                    className="absolute top-2 right-2 hidden rounded-full bg-red-500 p-1 text-white group-hover:block hover:bg-red-600"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="dropzone-file"
                  className="group hover:border-primary hover:text-primary relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-2 text-gray-400 md:h-52 md:w-52"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="mb-3"
                      width="28"
                      height="28"
                      viewBox="0 0 34 34"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M23 9H23.02H23Z" fill="#A0AEC0" />
                      <path
                        d="M23 9H23.02"
                        stroke="#A0AEC0"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M27 1H7C3.68629 1 1 3.68629 1 7V27C1 30.3137 3.68629 33 7 33H27C30.3137 33 33 30.3137 33 27V7C33 3.68629 30.3137 1 27 1Z"
                        stroke="#A0AEC0"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1 22.9999L9 14.9999C9.91212 14.1222 10.9468 13.6602 12 13.6602C13.0532 13.6602 14.0879 14.1222 15 14.9999L25 24.9999"
                        stroke="#A0AEC0"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M21 20.9999L23 18.9999C23.9121 18.1222 24.9468 17.6602 26 17.6602C27.0532 17.6602 28.0879 18.1222 29 18.9999L33 22.9999"
                        stroke="#A0AEC0"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p>
                      <span className="text-xs font-semibold">
                        Click to upload
                      </span>
                    </p>
                    <p className="text-center text-[10px]">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                  <input
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
            <div className="w-full">
              <div className="mb-3">
                <InputLabel className="text-sm">Company Name</InputLabel>
                <TextField
                  placeholder="Example Inc."
                  fullWidth
                  className="mt-2"
                  {...register("name", {
                    required: "Company Name is required",
                  })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              </div>
              <div className="mb-4">
                <InputLabel className="text-sm">Company Title</InputLabel>
                <TextField
                  placeholder="Official company title"
                  fullWidth
                  {...register("title")}
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="w-full">
                  <InputLabel className="text-sm">Email</InputLabel>
                  <TextField
                    type="email"
                    placeholder="contact@example.com"
                    fullWidth
                    className="mt-2"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </div>
                <div className="w-full">
                  <InputLabel className="text-sm">Year Founded</InputLabel>
                  <TextField
                    placeholder="2020"
                    fullWidth
                    type="number"
                    className="mt-2"
                    {...register("yearFounded", {
                      min: {
                        value: 1800,
                        message: "Enter a valid year",
                      },
                      max: {
                        value: new Date().getFullYear(),
                        message: "Year cannot be in the future",
                      },
                    })}
                    error={!!errors.yearFounded}
                    helperText={errors.yearFounded?.message}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-2 flex flex-col gap-3 md:flex-row md:items-center">
            <div className="w-full">
              <InputLabel className="relative mb-2 text-sm">
                Phone Number
              </InputLabel>
              <Box
                sx={{
                  mb: 1,
                  "& .PhoneInput": {
                    display: "flex",
                    border: errors.phone ? "1px solid red" : "1px solid #ccc",
                    height: "50px",
                    borderRadius: "10px",
                    alignItems: "center",
                    padding: "0 10px",
                  },
                }}
              >
                <Controller
                  control={control}
                  name="phone"
                  rules={{ required: "Phone number is required" }}
                  render={({ field }) => (
                    <PhoneNumberInput
                      {...field}
                      value={field.value || ""}
                      placeholder="Enter phone number"
                      onChange={(value) => {
                        clearErrors("phone");
                        field.onChange(value ?? "");
                      }}
                    />
                  )}
                />
                {errors.phone && (
                  <Typography sx={{ color: "red", fontSize: "12px", mt: 1 }}>
                    {errors.phone.message}
                  </Typography>
                )}
              </Box>
            </div>
            <div className="w-full">
              <InputLabel className="text-sm">Company Size</InputLabel>
              <Controller
                name="size"
                control={control}
                defaultValue="micro"
                render={({ field }) => (
                  <FormControl fullWidth>
                    <Select
                      {...field}
                      displayEmpty
                      MenuProps={{
                        disableScrollLock: true,
                      }}
                    >
                      <MenuItem value="micro">Micro (1-10 employees)</MenuItem>
                      <MenuItem value="small">Small (11-50 employees)</MenuItem>
                      <MenuItem value="medium">
                        Medium (51-200 employees)
                      </MenuItem>
                      <MenuItem value="large">
                        Large (201-500 employees)
                      </MenuItem>
                      <MenuItem value="enterprise">
                        Enterprise (500+ employees)
                      </MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </div>
          </div>

          <div className="mb-2 flex flex-col gap-3 md:flex-row">
            <div className="w-full">
              <InputLabel className="text-sm">Country</InputLabel>
              <Controller
                name="country"
                control={control}
                rules={{ required: "Country is required" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.country}>
                    <Select
                      {...field}
                      displayEmpty
                      MenuProps={{
                        disableScrollLock: true,
                      }}
                      onChange={(e) => {
                        const selectedCountry = countries.find(
                          (c) => c.isoCode === e.target.value,
                        );
                        field.onChange({
                          code: selectedCountry?.isoCode || "",
                          name: selectedCountry?.name || "",
                        });
                        // Reset state when country changes
                        setValue("state", { code: "", name: "" });
                      }}
                      value={field.value?.code || ""}
                      renderValue={(selected) => {
                        if (!selected) {
                          return (
                            <span className="text-sm text-gray-400">
                              Select Country
                            </span>
                          );
                        }
                        const selectedCountry = countries.find(
                          (c) => c.isoCode === selected,
                        );
                        return selectedCountry?.name || selected;
                      }}
                    >
                      {countries.map((country) => (
                        <MenuItem key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.country && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.country.message}
                      </p>
                    )}
                  </FormControl>
                )}
              />
            </div>

            <div className="w-full">
              <InputLabel className="text-sm">State/Region</InputLabel>
              <Controller
                name="state"
                control={control}
                rules={{ required: "State is required" }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.state}>
                    <Select
                      {...field}
                      displayEmpty
                      MenuProps={{
                        disableScrollLock: true,
                      }}
                      onChange={(e) => {
                        const selectedState = states.find(
                          (s) => s.isoCode === e.target.value,
                        );
                        field.onChange({
                          code: selectedState?.isoCode || "",
                          name: selectedState?.name || "",
                        });
                      }}
                      value={field.value?.code || ""}
                      disabled={!countryCode}
                      renderValue={(selected) => {
                        if (!selected) {
                          return (
                            <span className="text-sm text-gray-400">
                              {countryCode
                                ? "Select State"
                                : "Select Country first"}
                            </span>
                          );
                        }
                        const selectedState = states.find(
                          (s) => s.isoCode === selected,
                        );
                        return selectedState?.name || selected;
                      }}
                    >
                      {states.map((state) => (
                        <MenuItem key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.state && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.state.message}
                      </p>
                    )}
                  </FormControl>
                )}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <div className="w-full">
              <InputLabel className="relative text-sm">
                Company Sector
              </InputLabel>
              <Controller
                name="companySectorId"
                control={control}
                rules={{ required: "Sector is required" }}
                render={({ field }) => (
                  <FormControl
                    error={Boolean(errors.companySectorId)}
                    fullWidth
                  >
                    <Select
                      {...field}
                      displayEmpty
                      MenuProps={{ disableScrollLock: true }}
                      renderValue={(selected) => {
                        if (!selected)
                          return (
                            <span className="text-gray-400">Select Sector</span>
                          );
                        const selectedSector = sectors?.data.find(
                          (s) => s.id === selected,
                        );
                        return selectedSector?.name || selected;
                      }}
                    >
                      <MenuItem value="" disabled>
                        <span className="text-gray-400">Select Sector</span>
                      </MenuItem>
                      {sectors?.data.map((sector) => (
                        <MenuItem key={sector.id} value={sector.id}>
                          {sector.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <input type="hidden" {...register("companySectorName")} />
            </div>

            <div className="w-full">
              <InputLabel className="relative text-sm">Company Type</InputLabel>
              <Controller
                name="companyTypeId"
                control={control}
                rules={{ required: "Type is required" }}
                render={({ field }) => (
                  <FormControl error={Boolean(errors.companyTypeId)} fullWidth>
                    <Select
                      {...field}
                      displayEmpty
                      MenuProps={{ disableScrollLock: true }}
                      renderValue={(selected) => {
                        if (!selected)
                          return (
                            <span className="text-gray-400">Select Type</span>
                          );
                        const selectedType = types?.data.find(
                          (t) => t.id === selected,
                        );
                        return selectedType?.name || selected;
                      }}
                    >
                      <MenuItem value="" disabled>
                        <span className="text-gray-400">Select Type</span>
                      </MenuItem>
                      {types?.data.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
              <input type="hidden" {...register("companyTypeName")} />
            </div>
          </div>
          <div className="mt-4">
            <InputLabel className="text-sm">About the Company</InputLabel>
            <TextField
              placeholder="Brief description of the company"
              fullWidth
              rows={3}
              {...register("about")}
            />
          </div>
          {/* Improved Social Links Section */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <InputLabel className="text-sm font-medium text-gray-700">
                Social Links
              </InputLabel>
              <Button
                type="button"
                variant="outlined"
                size="small"
                onClick={handleAddSocialLink}
                startIcon={<Plus size={16} />}
                className="text-primary"
              >
                Add Link
              </Button>
            </div>

            <div className="space-y-4">
              {socialLinks.map((link, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-lg border border-gray-200 p-3 transition-all"
                >
                  <div className="flex-1 space-y-4">
                    <FormControl fullWidth>
                      <InputLabel className="relative text-xs">
                        Platform
                      </InputLabel>

                      <Select
                        label="Platform"
                        value={link.platform}
                        onChange={(e) =>
                          handleSocialLinkChange(
                            index,
                            "platform",
                            e.target.value,
                          )
                        }
                        displayEmpty
                        MenuProps={{ disableScrollLock: true }}
                      >
                        <MenuItem value="">
                          <p>Select platform</p>
                        </MenuItem>
                        <MenuItem value="website">Website</MenuItem>
                        <MenuItem value="linkedin">LinkedIn</MenuItem>
                        <MenuItem value="facebook">Facebook</MenuItem>
                        <MenuItem value="twitter">Twitter</MenuItem>
                        <MenuItem value="instagram">Instagram</MenuItem>
                        <MenuItem value="youtube">YouTube</MenuItem>
                        <MenuItem value="github">GitHub</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="URL"
                      value={link.url}
                      onChange={(e) =>
                        handleSocialLinkChange(index, "url", e.target.value)
                      }
                      placeholder="https://example.com"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Link2 size={16} className="text-gray-400" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>

                  {socialLinks.length > 1 && (
                    <IconButton
                      onClick={() => handleRemoveSocialLink(index)}
                      className="mt-2 text-red-500 hover:bg-red-50"
                      size="small"
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  )}
                </div>
              ))}
            </div>

            {socialLinks.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                <Globe className="mb-2 text-gray-400" size={24} />
                <Typography variant="body2" className="text-gray-500">
                  No social links added yet
                </Typography>
                <Button
                  type="button"
                  variant="text"
                  size="small"
                  onClick={handleAddSocialLink}
                  className="text-primary mt-2"
                >
                  Add your first link
                </Button>
              </div>
            )}
          </div>

          <div className="mt-3">
            <Controller
              name="isProfitable"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      {...field}
                      checked={field.value || false}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Is the company profitable?"
                />
              )}
            />
          </div>

          <DialogActions className="mt-4 flex flex-col items-center gap-5 md:flex-row md:items-start">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              className="w-full md:w-48"
            >
              {loading ? <CircularProgress size={24} /> : "Create Company"}
            </Button>

            <Button
              onClick={handleCloseModal}
              variant="outlined"
              className="w-full md:w-48"
            >
              Cancel
            </Button>
            {errorMessage && (
              <div className="mt-4 text-xs text-red-500">{errorMessage}</div>
            )}
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewEmployer;
