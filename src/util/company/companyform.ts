import { Company } from "@/types";

export const companyBanners = (company?: Company): FileWithPreview[] => {
  return (
    [company?.banner1, company?.banner2, company?.banner3].filter(Boolean).map(
      (image) =>
        ({
          lastModified: 0,
          name: "",
          webkitRelativePath: "",
          size: 0,
          type: "image/",
          preview: image || "",
          uploaded: true,
        }) as FileWithPreview,
    ) || []
  );
};


export function handleDuplicates(arr: string[], str: string): string {
  let result: string = str;
  let counter: number = 1;
  
  while (arr.includes(result)) {
      result = `${str} (${counter})`;
      counter++;
  }
  
  return result;
}