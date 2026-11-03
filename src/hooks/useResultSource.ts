"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { buildReport } from "@/lib/result-generator";
import { computeResult } from "@/lib/scoring";
import { cleanName } from "@/lib/share";
import { useHydrated, useTensionStore } from "@/store/useTensionStore";
import type { ResultReport, TensionResult } from "@/types";

export type ResultSource =
  | { status: "loading" }
  | { status: "empty" }
  | { status: "invalid" }
  | { status: "ok"; result: TensionResult; report: ResultReport; isMine: boolean; name: string };

/** Resolves a result from ?r= (shared link) or the user's own last result. */
export function useResultSource(): ResultSource {
  const params = useSearchParams();
  const hydrated = useHydrated();
  const ownCode = useTensionStore((s) => s.code);
  const ownName = useTensionStore((s) => s.name);
  const paramCode = params.get("r");
  const paramName = cleanName(params.get("n"));

  return useMemo<ResultSource>(() => {
    if (!hydrated) return { status: "loading" };
    const code = paramCode ?? ownCode;
    if (!code) return { status: "empty" };
    const result = computeResult(code);
    if (!result) return { status: "invalid" };
    const isMine = code === ownCode;
    return { status: "ok", result, report: buildReport(result), isMine, name: isMine ? ownName : paramName };
  }, [hydrated, paramCode, paramName, ownCode, ownName]);
}
