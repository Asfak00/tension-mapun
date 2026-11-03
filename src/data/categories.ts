import type { Category, CategoryId } from "@/types";

export const CATEGORIES: Category[] = [
  {
    id: "job",
    name: "Job Tension",
    emoji: "💼",
    color: "#FF793D",
    intensity: 1.1,
    tagline: "Boss-এর \"একটু আসেন\"",
    problems: ["চাকরি চলে যাওয়ার ভয়", "Boss-এর অতিরিক্ত pressure", "Salary না পাওয়া", "Office politics", "Layoff anxiety"],
    selectJokes: [
      "Boss-এর নাম শুনেই হাত কাঁপে? Noted.",
      "LinkedIn-এ \"Open to work\" frame-টা ready রাখেন।",
      "অফিসের Teams notification শুনলেই ভয়? ঠিক জায়গায় আসছেন।",
    ],
  },
  {
    id: "business",
    name: "Business Tension",
    emoji: "📉",
    color: "#E8FF65",
    intensity: 1.1,
    tagline: "COD মানে Cancel On Delivery",
    problems: ["Business loss", "Customer নেই", "Order cancel হচ্ছে", "Supplier payment", "Investment loss"],
    selectJokes: [
      "লাভের চেয়ে tension বেশি? Classic উদ্যোক্তা।",
      "Supplier-এর call দেখে ফোন উল্টে রাখেন, তাই না?",
      "Business না, এটা একটা extreme sport।",
    ],
  },
  {
    id: "relationship",
    name: "Relationship Tension",
    emoji: "💔",
    color: "#FF70B8",
    intensity: 1.15,
    tagline: "Seen দিয়ে চলে গেছে",
    problems: ["Girlfriend চলে গেছে", "চলে যাবে মনে হচ্ছে", "Reply আসে না", "Ex-এর বিয়ে", "Relationship complicated"],
    selectJokes: [
      "আহারে! Heart-এর WiFi disconnect?",
      "Last seen check করতে করতে আঙুলে ব্যথা?",
      "\"Typing...\" দেখে ৩ মিনিট অপেক্ষা, তারপর কিছুই না। বুঝি ভাই।",
    ],
  },
  {
    id: "money",
    name: "Money Tension",
    emoji: "💸",
    color: "#7CF2B0",
    intensity: 1.05,
    tagline: "মাস শেষ, টাকা শেষ",
    problems: ["মাস শেষ, টাকা শেষ", "Loan pressure", "EMI", "Unexpected expenses", "Salary survival"],
    selectJokes: [
      "বিকাশ balance দেখতে চোখ বন্ধ করেন? Same.",
      "Wallet-এ এখন শুধু পুরনো receipt আর আশা।",
      "মাসের ২০ তারিখ থেকে ডিম-ভাত diet চলছে?",
    ],
  },
  {
    id: "study",
    name: "Study Tension",
    emoji: "🎓",
    color: "#B78AFF",
    intensity: 1,
    tagline: "কালকে exam, আজকে syllabus খুঁজছি",
    problems: ["Exam সামনে", "পড়া হয়নি", "Assignment pending", "Result anxiety", "Career confusion"],
    selectJokes: [
      "বইয়ের cover দেখা কি পড়া হিসেবে গণ্য হয়? না।",
      "\"কাল থেকে পড়বো\" — ২০১৯ থেকে।",
      "Assignment-গুলো আপনাকে খুঁজছে।",
    ],
  },
  {
    id: "family",
    name: "Family Tension",
    emoji: "🏠",
    color: "#FFB547",
    intensity: 1,
    tagline: "\"বিয়ে কবে করবা?\"",
    problems: ["Family pressure", "Marriage pressure", "Parents expectations", "Relative problems"],
    selectJokes: [
      "ঈদের দাওয়াত = annual performance review।",
      "Sharmin আন্টির ছেলে আবার কী করেছে?",
      "Biodata ছাপা হয়ে গেছে? Condolence.",
    ],
  },
  {
    id: "social",
    name: "Social Life Tension",
    emoji: "📱",
    color: "#5CE1E6",
    intensity: 0.95,
    tagline: "সবাই বিয়ে করে ফেলছে",
    problems: ["Friends successful", "Everyone is getting married", "Social media comparison", "Feeling left behind"],
    selectJokes: [
      "\"Excited to announce\" পড়লেই বুক ধড়ফড়?",
      "Feed এখন একটা wedding album।",
      "Thumb দিনে ৩ কিলোমিটার scroll করে। Respect.",
    ],
  },
  {
    id: "future",
    name: "Future Tension",
    emoji: "🔮",
    color: "#C9A7FF",
    intensity: 1,
    tagline: "Future আমাকে block করেছে",
    problems: ["Career uncertainty", "Life direction", "Future anxiety", "Unknown problems"],
    selectJokes: [
      "আপনার future বর্তমানে আপনাকে avoid করছে।",
      "রাত ৩টার philosopher detected।",
      "Canada PR video কয়টা দেখেছেন আজকে?",
    ],
  },
  {
    id: "random",
    name: "Random / Unknown",
    emoji: "🌚",
    color: "#F9F5FF",
    intensity: 0.9,
    tagline: "নিজেও জানি না কী হয়েছে",
    problems: ["নিজেও জানি না কী হয়েছে", "ঘুম থেকে উঠেই tension লাগে", "সবকিছু ঠিক আছে, তারপরও শান্তি নেই"],
    selectJokes: [
      "Mystery tension. সবচেয়ে ভয়ংকর type।",
      "কারণ ছাড়া tension — Bangladeshi default mode।",
      "মাথায় ৪৭টা tab, কোনটায় গান বাজছে জানেন না।",
    ],
  },
];

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id);

export function getCategory(id: CategoryId): Category {
  return CATEGORIES.find((c) => c.id === id)!;
}

export function isCategoryId(value: unknown): value is CategoryId {
  return typeof value === "string" && (CATEGORY_IDS as string[]).includes(value);
}

/** Joke for the current selection count; the all-selected case wins. */
export function countJoke(count: number): string {
  if (count === CATEGORIES.length) return "ভাই, আপনি কি পুরো বাংলাদেশের সমস্যা একা solve করতে নামছেন?";
  if (count >= 7) return "Calculator-ও এখন ঘামতেছে।";
  if (count >= 5) return "আপনার মাথায় এখন ৪৭টা Chrome tab open!";
  if (count >= 3) return "এখন থেকে আপনি officially busy মানুষ।";
  if (count === 2) return "Combo pack! একটার সাথে আরেকটা free।";
  if (count === 1) return "মাত্র একটা? আপনি তো লাকি!";
  return "কিছু select করেন। আমরা বিচার করি না, শুধু হিসাব করি।";
}
