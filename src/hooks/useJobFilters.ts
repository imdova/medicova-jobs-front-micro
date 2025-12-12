import { educationOptions, jobWorkPlaceOptions } from "@/constants/job";
import { gendersOptions } from "@/constants";
import { mergeData } from "@/util/general";
import { useIndustriesData } from "@/hooks/useIndustriesData";
import { useLocationData } from "@/hooks/useLocationData";
import { useEffect, useCallback, useState } from "react";

const initialCountries = [
  { code: "SA", count: 0, name: "Saudi Arabia" },
  { code: "EG", count: 0, name: "Egypt" },
  { code: "AE", count: 0, name: "United Arab Emirates" },
  { code: "MA", count: 0, name: "Morocco" },
  { code: "DZ", count: 0, name: "Algeria" },
  { code: "IQ", count: 0, name: "Iraq" },
  { code: "JO", count: 0, name: "Jordan" },
  { code: "KW", count: 0, name: "Kuwait" },
  { code: "QA", count: 0, name: "Qatar" },
  { code: "LB", count: 0, name: "Lebanon" },
];

export const useJobFilters = (data: JobsAggregations | null): FilterType[] => {
  const [filters, setFilters] = useState<FilterType[]>([]);

  // Move hook calls to the top level
  const countriesCodes = data?.country?.map((x) => x.code) || [];
  const { countries, states } = useLocationData(countriesCodes);

  const {
    industries: { data: industries },
    categories: { data: categories },
    careerLevels: { data: careerLevels },
    specialities: { data: specialities },
    employmentTypes: { data: employmentTypes },
  } = useIndustriesData({ categoryId: "all", industryId: "all" });

  const generateFilters = useCallback(() => {
    if (!data) {
      setFilters([]);
      return;
    }

    const newFilters: FilterType[] = [];

    // COUNTRY
    if (data.country?.length) {
      data.country = mergeData(data.country, initialCountries, "code");
      newFilters.push({
        name: "Country",
        multiple: true,
        searchable: true,
        sectionKey: "country",
        maxItems: 8,
        items: data.country.map((item) => ({
          label:
            countries?.find((x) => x.isoCode === item.code)?.name ||
            item.name ||
            item.code,
          count: item.count,
          value: item.code,
        })),
      });
    }

    // STATE
    if (data.state?.length) {
      newFilters.push({
        name: "State",
        multiple: true,
        searchable: true,
        sectionKey: "state",
        items: data.state.map((item) => ({
          label: states?.find((x) => x.isoCode === item.code)?.name || item.code,
          count: item.count,
          value: item.code,
        })),
      });
    }

    // INDUSTRY
    if (data.industry?.length && industries?.data?.length) {
      const initialIndustry = industries.data.map((x) => ({
        id: x.id,
        name: x.name,
        count: 0,
      }));
      data.industry = mergeData(data.industry, initialIndustry, "id");
      newFilters.push({
        name: "Industry",
        multiple: true,
        sectionKey: "ind",
        items: data.industry.map((item) => ({
          label:
            industries.data.find((x) => x.id === item.id)?.name ||
            item.name ||
            item.id.slice(0, 5),
          count: item.count,
          value: item.id,
        })),
      });
    }

    // CATEGORY
    if (data.category?.length && categories?.data?.length) {
      const initialCategories = categories.data.map((x) => ({
        id: x.id,
        name: x.name,
        count: 0,
      }));
      data.category = mergeData(data.category, initialCategories, "id");
      newFilters.push({
        name: "Category",
        searchable: true,
        multiple: true,
        maxItems: 8,
        sectionKey: "ctg",
        items: data.category.map((item) => ({
          label:
            categories.data.find((x) => x.id === item.id)?.name ||
            item.name ||
            item.id.slice(0, 5),
          count: item.count,
          value: item.id,
        })),
      });
    }

    // SPECIALITY
    if (data.speciality?.length && specialities?.data?.length) {
      const initialSpecialities = specialities.data.map((x) => ({
        id: x.id,
        name: x.name,
        count: 0,
      }));
      data.speciality = mergeData(data.speciality, initialSpecialities, "id");
      newFilters.push({
        name: "Main Speciality",
        searchable: true,
        maxItems: 8,
        sectionKey: "sp",
        items: data.speciality.map((item) => ({
          label:
            specialities.data.find((x) => x.id === item.id)?.name ||
            item.name ||
            item.id.slice(0, 5),
          count: item.count,
          value: item.id,
        })),
      });
    }

    // CAREER LEVEL
    if (data.careerLevel?.length && careerLevels?.data?.length) {
      const initialCareerLevel = careerLevels.data.map((x) => ({
        id: x.id,
        name: x.name,
        count: 0,
      }));
      data.careerLevel = mergeData(data.careerLevel, initialCareerLevel, "id");
      newFilters.push({
        name: "Career Level",
        multiple: true,
        searchable: true,
        maxItems: 8,
        sectionKey: "clv",
        items: data.careerLevel.map((item) => ({
          label:
            careerLevels.data.find((x) => x.id === item.id)?.name ||
            item.name ||
            item.id.slice(0, 5),
          count: item.count,
          value: item.id,
        })),
      });
    }

    // EMPLOYMENT TYPE
    if (data.employmentType?.length && employmentTypes?.data?.length) {
      const initialEmploymentTypes = employmentTypes.data.map((x) => ({
        id: x.id,
        name: x.name,
        count: 0,
      }));
      data.employmentType = mergeData(
        data.employmentType,
        initialEmploymentTypes,
        "id",
      );
      newFilters.push({
        name: "Employment Type",
        multiple: true,
        sectionKey: "emp",
        items: data.employmentType.map((item) => ({
          label:
            employmentTypes.data.find((x) => x.id === item.id)?.name ||
            item.name ||
            item.id.slice(0, 5),
          count: item.count,
          value: item.id,
        })),
      });
    }

    // EDUCATION
    if (data.educationLevel?.length) {
      const initialEducation = educationOptions.map((x) => ({
        name: x.id,
        count: 0,
      }));
      data.educationLevel = mergeData(
        data.educationLevel,
        initialEducation,
        "name",
      );
      newFilters.push({
        name: "Education Level",
        multiple: true,
        sectionKey: "edu",
        items: data.educationLevel.map((item) => ({
          label:
            educationOptions.find((x) => x.id === item.name)?.label || item.name,
          count: item.count,
          value: item.name,
        })),
      });
    }

    // WORK PLACE
    if (data.workPlace?.length) {
      const initialWorkPlace = jobWorkPlaceOptions.map((x) => ({
        name: x.id,
        count: 0,
      }));
      data.workPlace = mergeData(data.workPlace, initialWorkPlace, "name");
      newFilters.push({
        name: "Work Place",
        multiple: true,
        sectionKey: "wp",
        items: data.workPlace.map((item) => ({
          label:
            jobWorkPlaceOptions.find((x) => x.id === item.name)?.label ||
            item.name,
          count: item.count,
          value: item.name,
        })),
      });
    }

    // GENDER
    if (data.gender?.length) {
      const initialGender = gendersOptions.map((x) => ({
        name: x.value,
        count: 0,
      }));
      data.gender = mergeData(data.gender, initialGender, "name");
      newFilters.push({
        name: "Gender",
        multiple: true,
        sectionKey: "gen",
        items: data.gender.map((item) => ({
          label:
            gendersOptions.find((x) => x.value === item.name)?.label ||
            item.name,
          count: item.count,
          value: item.name,
        })),
      });
    }

    // SALARY
    if (data.salaryRange?.length) {
      newFilters.push({
        name: "Salary Range",
        sectionKey: "sal",
        items: data.salaryRange.map((item) => ({
          label: `${item.from}-${item.to}`,
          count: item.count,
          value: `${item.from}-${item.to}`,
        })),
      });
    }

    // AGE
    if (data.ageRange?.length) {
      newFilters.push({
        name: "Age",
        sectionKey: "age",
        items: data.ageRange.map((item) => ({
          label: `${item.from}-${item.to}`,
          count: item.count,
          value: `${item.from}-${item.to}`,
        })),
      });
    }

    setFilters(newFilters);
  }, [data, countries, states, industries, categories, careerLevels, specialities, employmentTypes]);

  useEffect(() => {
    generateFilters();
  }, [generateFilters]);

  return filters;
};
