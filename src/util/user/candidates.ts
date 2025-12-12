import { CandidateType, TapType } from "@/types/seeker";

export function filterCandidates(
  candidates: CandidateType[],
  tab: TapType,
): CandidateType[] {
  switch (tab) {
    case "all":
      return candidates;
    case "locked":
      return candidates.filter((candidate) => candidate.isLocked);
    case "unlocked":
      return candidates.filter((candidate) => !candidate.isLocked);
    case "shortListed":
      return candidates.filter((candidate) => candidate.isFavorite);
    default:
      return candidates;
  }
}
