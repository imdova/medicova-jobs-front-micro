import React from "react";
import { Button } from "@mui/material";
import JobOverview from "@/components/UI/JobOverview";
import {
  LocationOnOutlined,
  MedicalServicesOutlined,
  SchoolOutlined,
} from "@mui/icons-material";
import { JobData } from "@/types";
import { formatEducationAndSpecialty } from "@/util";

interface ReviewPublishStepProps {
  jobData: JobData;
  onDraft: (data?: Partial<JobData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
  draftLoading: boolean;
  isDirty: boolean;
  error: string;
}
const ReviewPublishStep: React.FC<ReviewPublishStepProps> = ({
  jobData,
  onBack,
  onDraft,
  onSubmit,
  loading,
  draftLoading,
  error,
  isDirty,
}) => {
  const education = formatEducationAndSpecialty(jobData);
  return (
    <div>
      <div className="w-full px-2 md:px-6">
        <div className="mb-6 flex justify-between">
          <div className="flex flex-col justify-between">
            <span className="mb-2 w-fit rounded-md bg-[#82c341]/40 px-2 py-1 text-xs font-semibold text-primary">
              Now
            </span>
            <h1 className="mb-4 text-4xl font-bold text-main">
              {jobData.title}
            </h1>
            <div className="flex flex-wrap gap-3">
              <div className="rounded-md text-sm text-gray-500">
                <LocationOnOutlined className="h-4 w-4 text-secondary md:h-5 md:w-5" />
                <span className="ml-2 text-xs md:text-base">
                  {jobData.country?.name + ", " + jobData.city}
                </span>
              </div>
              {education && (
                <div className="rounded-md text-sm text-gray-500">
                  <SchoolOutlined className="h-4 w-4 text-secondary md:h-5 md:w-5" />
                  <span className="ml-2 text-xs md:text-base">{education}</span>
                </div>
              )}
              <div className="rounded-md text-sm text-gray-500">
                <MedicalServicesOutlined className="h-4 w-4 text-secondary md:h-5 md:w-5" />
                <span className="ml-2 text-xs md:text-base">
                  {jobData.jobCategory}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col sm:flex-row sm:gap-8">
          <div className="flex-1">
            {/* Job Description */}
            {jobData.description && (
              <div className="max-w-[800px] overflow-hidden">
                <h3 className="text-xl font-semibold text-main">
                  Job Description
                </h3>
                <div
                  className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl max-w-[800px] text-wrap"
                  dangerouslySetInnerHTML={{ __html: jobData.description }}
                />
              </div>
            )}
            {/* Job Overview only on mobile */}
            <JobOverview
              key={1}
              data={jobData}
              className="mt-8 block rounded-[10px] bg-green-50 p-4 md:hidden"
            />

            {/* Job Responsibilities */}
            {jobData.requirements && (
              <>
                <h3 className="mt-8 text-xl font-semibold text-main">
                  Job Requirements
                </h3>
                <div
                  className="prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl"
                  dangerouslySetInnerHTML={{ __html: jobData.requirements }}
                />
              </>
            )}
            {jobData.salaryDetails && (
              <>
                <h3 className="mt-8 text-xl font-semibold text-main">
                  Additional Details
                </h3>
                <p>{jobData.salaryDetails}</p>
              </>
            )}

            {/* Skills related to the jobData post */}
            <h3 className="mt-8 text-xl font-semibold text-main">
              Skills related to the job post{" "}
            </h3>
            <div className="mt-2 flex flex-wrap">
              {jobData.skills?.map((skill, i) => (
                <button
                  key={i}
                  className="mb-2 mr-2 rounded-md bg-primary/10 px-2 py-1 text-main duration-100 hover:bg-primary hover:text-primary-foreground"
                >
                  {skill}
                </button>
              ))}
            </div>

            {/* Related Search */}
            <h3 className="mt-8 text-xl font-semibold text-main">
              Related Search
            </h3>
            <div className="mt-2 flex flex-wrap">
              {jobData.keywords?.map((keyWord, i) => (
                <button
                  key={i}
                  className="mb-2 mr-2 rounded-md bg-primary/10 px-2 py-1 text-main duration-100 hover:bg-primary hover:text-primary-foreground"
                >
                  {keyWord}
                </button>
              ))}
            </div>
          </div>
          {/* Job Overview only on desktop */}
          <JobOverview
            key={2}
            data={jobData}
            className="sticky top-[80px] hidden h-fit w-72 rounded-[10px] bg-primary/10 p-4 md:block"
          />
        </div>
      </div>
      <p className="text-red-500"> {error}</p>
      <div className="space-between sticky bottom-5 mt-5 flex gap-2 rounded-base border border-gray-100 bg-white p-4 shadow-lg md:justify-end">
        <Button onClick={() => onBack()} variant="outlined">
          Back
        </Button>
        <Button
          onClick={() => onDraft()}
          disabled={draftLoading || !isDirty}
          className="bg-[#FFAE35] text-[#464748] hover:bg-[#e19e39]"
        >
          {draftLoading ? "Loading... " : "Save and Publish Later"}
        </Button>
        <Button
          disabled={loading || !isDirty}
          onClick={() => onSubmit()}
          type="submit"
          variant="contained"
        >
          {loading ? "Loading..." : jobData.id ? "Update" : "Publish"}
        </Button>
      </div>
    </div>
  );
};

export default ReviewPublishStep;
