import { JobData, JobStringData } from "@/types";

export function transformToJsonStrings(
  data: Partial<JobData>,
): Partial<JobStringData> {
  const { country, keywords, skills, questions, ...job } = data;
  return {
    country: JSON.stringify(country),
    keywords: JSON.stringify(keywords),
    skills: JSON.stringify(skills),
    questions: JSON.stringify(questions),
    ...job,
  };
}

// Function to transform JSON strings back to objects/arrays
export function transformFromJsonStrings(
  data: Partial<JobStringData>,
): Partial<JobData> {
  const { country, keywords, skills, questions, ...job } = data;
  return {
    country: country !== undefined ? JSON.parse(country) : null,
    keywords: keywords !== undefined ? JSON.parse(keywords) : null,
    skills: skills !== undefined ? JSON.parse(skills) : null,
    questions: questions !== undefined ? JSON.parse(questions) : null,
    ...job,
  };
}
