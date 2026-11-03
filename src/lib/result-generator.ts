import { DIAGNOSES, HEADLINES, LEVEL_DIAGNOSIS_SUFFIX, PERFECT_HEADLINE, PREDICTIONS, SHARE_JOKES, ZERO_HEADLINE } from "@/data/jokes";
import { GENERIC_MEDICINES, GENERIC_TREATMENT, RX, SEVERITY, type Medicine } from "@/data/prescriptions";
import type { CategoryId, ResultReport, Stat, TensionResult } from "@/types";
import { clamp, mulberry32, pick } from "./random";
import { toBn } from "./bn";

export interface Prescription {
  diagnosis: string;
  treatments: string[];
  medicines: Medicine[];
}

/** Selected categories, highest tension first; ties keep canonical order. */
export function rankCategories(result: TensionResult): CategoryId[] {
  return [...result.categories].sort(
    (a, b) => (result.categoryScores[b] ?? 0) - (result.categoryScores[a] ?? 0),
  );
}

export function buildPrescription(result: TensionResult): Prescription {
  const ranked = rankCategories(result);
  const treatments: string[] = [];
  for (let round = 0; treatments.length < 4 && round < 3; round++) {
    for (const id of ranked) {
      if (treatments.length >= 4) break;
      const list = RX[id].treatments;
      treatments.push(list[(result.seed + round) % list.length]);
    }
  }
  treatments.push(GENERIC_TREATMENT);

  const medicines = [...ranked.slice(0, 2).map((id) => RX[id].medicine), ...GENERIC_MEDICINES];
  const syndrome = RX[result.topCategory].syndrome;
  const diagnosis =
    ranked.length >= 4
      ? `${SEVERITY[result.level.id]} Overthinking Syndrome (with ${syndrome})`
      : `${SEVERITY[result.level.id]} ${syndrome}`;

  return { diagnosis, treatments, medicines };
}

function buildStats(score: number, rand: () => number): Stat[] {
  const jitter = (n: number) => Math.round(rand() * n);
  const pressure = clamp(score + jitter(8) - 4, 1, 100);
  const overthinking = score < 25 ? "LOW" : score < 50 ? "MEDIUM" : score < 75 ? "HIGH" : "MAXIMUM";
  const sleep = clamp(100 - score - jitter(10), 2, 98);
  const confidence = clamp(95 - score - jitter(12), 1, 95);
  const battery = clamp(100 - score - jitter(8), 1, 99);
  const tabs = Math.round(3 + score * 0.5 + jitter(10));
  return [
    { label: "Mental Pressure", value: `${toBn(pressure)}%`, bar: pressure },
    { label: "Overthinking Power", value: overthinking, bar: clamp(score + 15, 10, 100) },
    { label: "Sleep Probability", value: `${toBn(sleep)}%`, bar: sleep },
    { label: "Future Confidence", value: `${toBn(confidence)}%`, bar: confidence },
    { label: "Brain Battery", value: `${toBn(battery)}%`, bar: battery },
    { label: "মাথায় খোলা Tab", value: `${toBn(tabs)}টা`, bar: clamp(tabs, 5, 100) },
  ];
}

/** All jokes come from a PRNG seeded by the share code, so reloads match. */
export function buildReport(result: TensionResult): ResultReport {
  const rand = mulberry32(result.seed);
  const { score, level, topCategory } = result;
  const headline =
    score === 100 ? PERFECT_HEADLINE : score === 0 ? ZERO_HEADLINE : pick(HEADLINES[level.id], rand);
  const diagnosis = `${pick(DIAGNOSES[topCategory], rand)} ${LEVEL_DIAGNOSIS_SUFFIX[level.id]}`;
  const prediction = pick(PREDICTIONS[level.id], rand);
  const stats = buildStats(score, rand);
  const shareJoke = pick(SHARE_JOKES, rand);
  const { treatments } = buildPrescription(result);
  return { headline, diagnosis, prediction, treatments, stats, shareJoke };
}
