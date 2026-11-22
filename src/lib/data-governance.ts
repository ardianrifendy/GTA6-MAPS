import { VerificationStatus } from "@/types";

export interface StatusMetadata {
  label: string;
  badgeClass: string;
  dotColor: string;
  description: string;
}

export function getStatusMetadata(status: VerificationStatus): StatusMetadata {
  switch (status) {
    case "CONFIRMED":
      return {
        label: "Confirmed (Official)",
        badgeClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        dotColor: "bg-emerald-400",
        description: "Directly confirmed via official Rockstar Games trailers, screenshots, or publications.",
      };
    case "VERIFIED_COMMUNITY":
      return {
        label: "Verified by Community",
        badgeClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
        dotColor: "bg-cyan-400",
        description: "Cross-verified by multiple community mapping cartographers and geographical analysis.",
      };
    case "COMMUNITY_REPORTED":
      return {
        label: "Community Reported",
        badgeClass: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        dotColor: "bg-amber-400",
        description: "Reported by players or single sources; awaiting secondary corroboration.",
      };
    case "UNVERIFIED":
      return {
        label: "Unverified / Speculative",
        badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        dotColor: "bg-purple-400",
        description: "Plausible gameplay hypothesis or legacy reference; not yet verified in-game.",
      };
    case "UNKNOWN":
    default:
      return {
        label: "Unknown / Pending Release",
        badgeClass: "bg-zinc-500/10 text-zinc-400 border-zinc-500/30",
        dotColor: "bg-zinc-400",
        description: "Data not yet available. Deliberately kept empty to prevent misinformation.",
      };
  }
}
