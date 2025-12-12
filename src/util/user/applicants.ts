import { ApplicationsType, TapType } from "@/types/seeker";

export function filterApplicants(
  candidates: ApplicationsType[],
  tab: TapType,
): ApplicationsType[] {
  switch (tab) {
    case "all":
      return candidates;
    case "locked":
      return candidates.filter((candidate) => candidate.applicant.isLocked);
    case "unlocked":
      return candidates.filter((candidate) => !candidate.applicant.isLocked);
    case "shortListed":
      return candidates.filter(
        (candidate) => candidate.status === "Shortlisted",
      );
    default:
      return candidates;
  }
}
