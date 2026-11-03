import type { CategoryId } from "@/types";

export const POSTER_CRIME: Record<CategoryId, string> = {
  job: "Boss-এর একটা \"Hi\" দেখে resignation letter লেখা",
  business: "COD order-এ অন্ধ বিশ্বাস রাখা",
  relationship: "দিনে ৮৭ বার last seen check করা",
  money: "মাসের ১৫ তারিখেই salary শেষ করা",
  study: "\"কাল থেকে পড়বো\" বলা (২০১৯ থেকে)",
  family: "ঈদে \"বিয়ে কবে?\" প্রশ্ন এড়িয়ে পালানো",
  social: "রাত ২টায় LinkedIn খুলে নিজেকে ব্যর্থ ঘোষণা",
  future: "রাত ৩টায় জীবনের মানে খোঁজা",
  random: "কোনো কারণ ছাড়াই tension নেওয়া",
};

export const POSTER_POOLS = {
  nickname: ["Overthinking King", "Tension-এর রাণী", "৪৭ Tab ভাই", "Seen-zone Specialist", "Chief Worry Officer", "মাস-শেষের যোদ্ধা", "রাত ৩টার দার্শনিক", "Boss-ভীতু বাহিনী প্রধান"],
  area: ["মিরপুর ১০-এর জ্যাম", "ফার্মগেট ওভারব্রিজ", "বসুন্ধরার মেস", "চকবাজারের চায়ের দোকান", "উত্তরা সেক্টর ৭", "মোহাম্মদপুর বাসস্ট্যান্ড", "নীলক্ষেত বই মার্কেট", "নিজের বিছানার এক কোনা"],
  job: ["Professional Overthinker", "Full-time Excel ভক্ত", "Part-time উদ্যোক্তা", "চিরস্থায়ী student", "Unpaid family IT support", "Freelancer (payment pending)", "Meeting-এ mute থাকা কর্মী", "Daraz cart curator"],
  crime: [
    "অতিরিক্ত overthinking",
    "\"৫ মিনিট আসছি\" বলে ২ ঘণ্টা দেরি করা",
    "রাত ৪টায় পুরনো chat পড়া",
    "Group project-এ শুধু নাম দেওয়া",
    "বিকাশ balance দেখে অজ্ঞান হওয়া",
    "\"সব ঠিক আছে\" বলে মিথ্যা বলা",
  ],
};

export const TEMPLATES = [
  { id: "wanted", label: "WANTED 🤠", note: "Dead or Tensed" },
  { id: "cinema", label: "বাংলা সিনেমা 🎬", note: "আসিতেছে!" },
  { id: "missing", label: "নিখোঁজ সংবাদ 📰", note: "মনের শান্তি হারিয়ে গেছে" },
] as const;

export type TemplateId = (typeof TEMPLATES)[number]["id"];

export const POSTER_SIZE = { width: 1080, height: 1350 };
