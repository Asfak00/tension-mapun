import type { CategoryId, LevelId } from "@/types";

export interface Medicine {
  name: string;
  dose: string;
}

export interface CategoryRx {
  syndrome: string;
  treatments: string[];
  medicine: Medicine;
}

export const RX: Record<CategoryId, CategoryRx> = {
  job: {
    syndrome: "Acute Boss-o-phobia",
    treatments: [
      "Boss-এর message ১০ মিনিট পরে দেখুন। আগে এক গ্লাস পানি।",
      "Sunday রাতে office-এর email খোলা সম্পূর্ণ নিষেধ।",
      "LinkedIn-এ job খোঁজা চালিয়ে যান, তবে office WiFi-তে না।",
    ],
    medicine: { name: "Bossocalm 250mg", dose: "\"একটু আসেন\" শোনার ৫ মিনিট আগে" },
  },
  business: {
    syndrome: "Chronic COD Trauma",
    treatments: [
      "Supplier-এর call ধরার আগে ৩ বার গভীর শ্বাস নিন।",
      "Excel খোলার আগে চা খান, পরে না।",
      "COD customer-এর সাথে emotional attachment নিষেধ।",
    ],
    medicine: { name: "Profitamol 500mg", dose: "Sales report দেখার আগে, ভরা পেটে" },
  },
  relationship: {
    syndrome: "Chronic Seen-zone Syndrome",
    treatments: [
      "Ex-এর profile দেখা সম্পূর্ণ নিষেধ।",
      "Last seen check দিনে সর্বোচ্চ ২ বার। ৮৭ বার না।",
      "\"আমাদের কথা বলা দরকার\" শুনলে আগে খেয়ে নিন।",
    ],
    medicine: { name: "NoReplycin", dose: "Seen দেখার সাথে সাথে, এক গ্লাস ঠান্ডা পানির সাথে" },
  },
  money: {
    syndrome: "End-of-Month Wallet Failure",
    treatments: [
      "টাকা না থাকলে অপ্রয়োজনীয় online shopping বন্ধ করুন।",
      "Cart খুলে শুধু দেখুন, \"Place Order\" চাপবেন না।",
      "বন্ধুকে ধার দেওয়ার আগে নিজেকে একবার ধার দিন।",
    ],
    medicine: { name: "Salaryfen Forte", dose: "মাসের ২০ তারিখ থেকে প্রতিদিন" },
  },
  study: {
    syndrome: "Pre-Exam Panic Disorder",
    treatments: [
      "পড়ার টেবিলে phone রাখা নিষেধ। Phone-ও পড়তে দেয় না।",
      "রাত ৩টায় \"কাল থেকে পড়বো\" সিদ্ধান্ত নেওয়া বন্ধ করুন।",
      "Syllabus প্রিন্ট করুন। অন্তত দেখবেন কতটা বাকি।",
    ],
    medicine: { name: "Examazole DS", dose: "Exam-এর আগের রাতে, ভয় পাওয়ার পরে" },
  },
  family: {
    syndrome: "Eid Interview Anxiety",
    treatments: [
      "দাওয়াতে খাওয়া শুরু হলে plate নিয়ে কোনায় চলে যান।",
      "\"বিয়ে কবে?\" প্রশ্নে \"ইনশাআল্লাহ\" বলে বিষয় পরিবর্তন করুন।",
      "Family group mute করুন, কিন্তু group ছাড়বেন না।",
    ],
    medicine: { name: "Familiquil 10mg", dose: "ঈদের আগের দিন থেকে ৩ দিন" },
  },
  social: {
    syndrome: "FOMO Scrollitis",
    treatments: [
      "রাত ১১টার পর LinkedIn খোলা নিষেধ।",
      "অন্যের বিয়ের ছবি দেখে নিজের life timeline বানাবেন না।",
      "সপ্তাহে একদিন phone ছাড়া বন্ধুদের সাথে আড্ডা দিন।",
    ],
    medicine: { name: "Scrollstop 200mg", dose: "প্রতি ৩০ মিনিট scroll করার পর" },
  },
  future: {
    syndrome: "Future-o-phobia",
    treatments: [
      "আগামী ৫ বছরের না, আগামী ৫ দিনের plan করুন।",
      "রাত ৩টার philosophy session বন্ধ করে ঘুমান।",
      "Canada PR video সপ্তাহে একটায় সীমিত রাখুন।",
    ],
    medicine: { name: "Futurexin XR", dose: "Overthinking শুরু হওয়ার সাথে সাথে" },
  },
  random: {
    syndrome: "Unknown Tension Syndrome",
    treatments: [
      "দিনে ৩ বার ঘুমানোর চেষ্টা করুন।",
      "মাথার ৪৭টা tab থেকে অন্তত ২০টা বন্ধ করুন।",
      "কারণ ছাড়া tension লাগলে, কারণ ছাড়াই একটু হাসুন।",
    ],
    medicine: { name: "Overthinkol", dose: "যখন কারণ ছাড়া tension লাগবে" },
  },
};

export const GENERIC_TREATMENT = "সপ্তাহে অন্তত একদিন নিজের জন্য বাঁচুন।";

export const GENERIC_MEDICINES: Medicine[] = [
  { name: "Chillax 500mg", dose: "দিনে ২ বার, চায়ের সাথে" },
  { name: "Mapun Plus", dose: "যখন বেশি tension হবে, তখন বন্ধুদের সঙ্গে আড্ডা দিন" },
];

export const SEVERITY: Record<LevelId, string> = {
  chill: "Mild",
  minor: "Moderate",
  gorom: "Hot-Headed",
  jhamela: "Severe",
  emergency: "Critical",
};
