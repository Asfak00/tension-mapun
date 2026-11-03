"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CategoryPicker } from "@/components/categories/CategoryPicker";
import { Loading } from "@/components/shared/Loading";
import { isCategoryId } from "@/data/categories";
import { encodeResult, sortCategories } from "@/lib/scoring";
import { useHydrated, useTensionStore } from "@/store/useTensionStore";
import type { Answer } from "@/types";
import { Questionnaire } from "./Questionnaire";

export function TensionFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const hydrated = useHydrated();
  const selected = useTensionStore((s) => s.selected);
  const toggleCategory = useTensionStore((s) => s.toggleCategory);
  const finish = useTensionStore((s) => s.finish);
  const [step, setStep] = useState<"pick" | "quiz">("pick");
  const preselected = useRef(false);
  const quizCategories = useMemo(() => sortCategories(selected), [selected]);

  // A sticker on the landing page links here with ?cat=<id>.
  useEffect(() => {
    if (!hydrated || preselected.current) return;
    preselected.current = true;
    const cat = params.get("cat");
    if (isCategoryId(cat) && !useTensionStore.getState().selected.includes(cat)) toggleCategory(cat);
  }, [hydrated, params, toggleCategory]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  const onFinish = useCallback(
    (answers: Answer[]) => {
      const code = encodeResult(selected, answers);
      finish(code);
      router.push(`/result?r=${code}`);
    },
    [selected, finish, router],
  );

  if (!hydrated) return <Loading />;

  return step === "pick" ? (
    <CategoryPicker selected={selected} onToggle={toggleCategory} onContinue={() => setStep("quiz")} />
  ) : (
    <Questionnaire categories={quizCategories} onFinish={onFinish} onBack={() => setStep("pick")} />
  );
}
