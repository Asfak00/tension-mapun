import { CATEGORY_IDS, getCategory } from "@/data/categories";
import { LEVELS } from "@/data/jokes";
import { QUESTIONS } from "@/data/questions";
import type { Answer, CategoryId, Level, Question, TensionResult } from "@/types";
import { clamp, hashString } from "./random";

export const MAX_QUESTIONS = 12;
/** A skipped question still counts: dodging is suspicious. */
export const SKIP_POINTS = 60;
const RAW_WEIGHT = 0.9;
const LOAD_BONUS_PER_EXTRA = 1.5;
const LOAD_BONUS_MAX = 12;

/** Canonical category order, independent of click order. */
export function sortCategories(categories: CategoryId[]): CategoryId[] {
  return CATEGORY_IDS.filter((id) => categories.includes(id));
}

/** Round-robin over selected categories so the quiz mixes topics. */
export function buildQuiz(categories: CategoryId[]): Question[] {
  const ordered = sortCategories(categories);
  const quiz: Question[] = [];
  for (let round = 0; quiz.length < MAX_QUESTIONS; round++) {
    let added = false;
    for (const id of ordered) {
      const question = QUESTIONS[id][round];
      if (question && quiz.length < MAX_QUESTIONS) {
        quiz.push(question);
        added = true;
      }
    }
    if (!added) break;
  }
  return quiz;
}

/** Share code: category letters, dash, one char per answer ("x" = skipped). */
export function encodeResult(categories: CategoryId[], answers: Answer[]): string {
  const cats = sortCategories(categories)
    .map((id) => String.fromCharCode(97 + CATEGORY_IDS.indexOf(id)))
    .join("");
  const ans = answers.map((a) => (a === null ? "x" : String(a))).join("");
  return `${cats}-${ans}`;
}

export function decodeResult(code: string): { categories: CategoryId[]; answers: Answer[] } | null {
  const match = /^([a-z]{1,9})-([0-9x]{1,12})$/.exec(code);
  if (!match) return null;
  const letters = match[1].split("");
  if (new Set(letters).size !== letters.length) return null;
  const categories: CategoryId[] = [];
  for (const letter of letters) {
    const id = CATEGORY_IDS[letter.charCodeAt(0) - 97];
    if (!id) return null;
    categories.push(id);
  }
  if (encodeResult(categories, []).split("-")[0] !== match[1]) return null;
  const quiz = buildQuiz(categories);
  const answers: Answer[] = match[2].split("").map((c) => (c === "x" ? null : Number(c)));
  if (answers.length !== quiz.length) return null;
  const valid = answers.every((a, i) => a === null || a < quiz[i].options.length);
  return valid ? { categories, answers } : null;
}

export function levelFor(score: number): Level {
  return LEVELS.find((l) => score >= l.min && score <= l.max) ?? LEVELS[LEVELS.length - 1];
}

/** Deterministic: the same code always yields the same score. */
export function computeResult(code: string): TensionResult | null {
  const decoded = decodeResult(code);
  if (!decoded) return null;
  const { categories, answers } = decoded;
  const quiz = buildQuiz(categories);

  const totals: Partial<Record<CategoryId, { sum: number; count: number }>> = {};
  quiz.forEach((question, i) => {
    const answer = answers[i];
    const points = answer === null ? SKIP_POINTS : question.options[answer].points;
    const entry = (totals[question.category] ??= { sum: 0, count: 0 });
    entry.sum += points;
    entry.count += 1;
  });

  const categoryScores: Partial<Record<CategoryId, number>> = {};
  let weighted = 0;
  let weights = 0;
  for (const id of categories) {
    const entry = totals[id]!;
    const avg = entry.sum / entry.count;
    categoryScores[id] = Math.round(avg);
    const { intensity } = getCategory(id);
    weighted += avg * intensity;
    weights += intensity;
  }

  const raw = weighted / weights;
  const loadBonus = Math.min(LOAD_BONUS_MAX, (categories.length - 1) * LOAD_BONUS_PER_EXTRA);
  const score = clamp(Math.round(raw * RAW_WEIGHT + loadBonus), 0, 100);

  const topCategory = categories.reduce((best, id) =>
    (categoryScores[id] ?? 0) > (categoryScores[best] ?? 0) ? id : best,
  );
  const skipped = answers.filter((a) => a === null).length;

  return {
    code,
    score,
    level: levelFor(score),
    categories,
    categoryScores,
    topCategory,
    answered: answers.length - skipped,
    skipped,
    seed: hashString(code),
  };
}
