import type { CategoryId, Level, LevelId } from "@/types";

export const LEVELS: Level[] = [
  { id: "chill", min: 0, max: 20, name: "Chill Bro.", bn: "ঠান্ডা মাথার মানুষ", color: "#E8FF65", mood: "chill" },
  { id: "minor", min: 21, max: 40, name: "Minor Tension", bn: "হালকা ধোঁয়া", color: "#B78AFF", mood: "worried" },
  { id: "gorom", min: 41, max: 60, name: "Matha Gorom", bn: "মাথা গরম", color: "#FF793D", mood: "panic" },
  { id: "jhamela", min: 61, max: 80, name: "Life E Jhamela", bn: "লাইফে ঝামেলা", color: "#FF70B8", mood: "meltdown" },
  { id: "emergency", min: 81, max: 100, name: "MAPUN EMERGENCY", bn: "জরুরি অবস্থা", color: "#FF3B3B", mood: "dead" },
];

export const HEADLINES: Record<LevelId, string[]> = {
  chill: [
    "ভাই, আপনি তো tension-এর vaccine নিয়ে আসছেন!",
    "আপনার শান্তি দেখে আমাদেরই tension লাগছে।",
    "পুকুর পাড়ে বসে চা খাওয়া মানুষ detected।",
  ],
  minor: [
    "ছোটখাটো tension, এক কাপ চা খেলেই সেরে যাবে।",
    "আপনার tension এখনো trial version-এ।",
    "হালকা ধোঁয়া উঠছে, আগুন এখনো লাগেনি।",
  ],
  gorom: [
    "মাথা গরম! কেউ ফ্যানটা ছাড়েন।",
    "আপনার brain এখন pressure cooker, ২টা সিটি বেজে গেছে।",
    "AC নষ্ট বাসে মিরপুরের জ্যাম — এই হলো আপনার অবস্থা।",
  ],
  jhamela: [
    "ভাই, আপনার অবস্থা তো সুবিধার মনে হচ্ছে না!",
    "Life-এ ঝামেলা না, ঝামেলাই আপনার life।",
    "আপনি tension নিচ্ছেন, নাকি tension আপনাকে নিচ্ছে?",
  ],
  emergency: [
    "ভাই, আপনি তো পুরাই শেষ!",
    "আপনার tension দেখে tension নিজেই ভয় পেয়েছে!",
    "এই পরিস্থিতিতে Google-ও আপনাকে সাহায্য করতে পারবে না।",
  ],
};

export const PERFECT_HEADLINE = "SYSTEM OVERLOAD. MAPUN TEAM HAS BEEN NOTIFIED.";
export const ZERO_HEADLINE = "Score শূন্য। আপনি মানুষ নাকি বুদ্ধ মূর্তি?";

export const DIAGNOSES: Record<CategoryId, string[]> = {
  job: [
    "আপনার অবস্থা এমন যে Boss-এর একটা Hi দেখলেও আপনি resignation letter লিখতে শুরু করেন।",
    "আপনার শরীর বাসায় থাকে, কিন্তু আত্মা এখনো office-এর Teams call-এ আটকে আছে।",
  ],
  business: [
    "আপনার business plan-এর নাম \"দেখি কী হয়\"। Supplier-এর call আপনার alarm-এর চেয়েও বেশি বাজে।",
    "আপনি ব্যবসা করছেন না, ব্যবসা আপনাকে করছে।",
  ],
  relationship: [
    "আপনি দিনে ৮৭ বার phone unlock করেন, শুধু দেখতে reply এসেছে কিনা। আসেনি।",
    "আপনার হৃদয়ে এখন নীল দুইটা tick-এর tattoo।",
  ],
  money: [
    "আপনার wallet-এ এখন শুধু পুরনো receipt আর অনেক আশা।",
    "আপনার bank account আপনাকে চিনতে পারছে না। Balance দেখে app নিজেই log out করে দেয়।",
  ],
  study: [
    "আপনার brain-এ syllabus নেই, আছে \"পরে পড়বো\" লেখা ৩২টা sticky note।",
    "Exam hall-এ গিয়ে আপনি প্রশ্নপত্রকেই প্রশ্ন করবেন: কেন?",
  ],
  family: [
    "আপনার জীবনের প্রতিটা সিদ্ধান্ত family WhatsApp group-এ vote দিয়ে পাস হয়।",
    "ঈদ আসলেই আপনার ভেতরে একটা interview anxiety জেগে ওঠে।",
  ],
  social: [
    "আপনি ৫ মিনিট Facebook চালিয়ে ৫ বছর পিছিয়ে পড়া অনুভব করেন।",
    "আপনার thumb দিনে ৩ কিলোমিটার scroll করে। Olympic-এ এই event নেই, এটা দুঃখজনক।",
  ],
  future: [
    "আপনার future বর্তমানে আপনাকে avoid করছে।",
    "রাত ৩টায় আপনার brain একটা TED Talk দেয়, শ্রোতা শুধু আপনি।",
  ],
  random: [
    "আপনার brain বর্তমানে ৪৭টা tab নিয়ে কাজ করছে। ১২টা tab not responding।",
    "আপনার tension-এর কোনো কারণ নেই, আর এটাই সবচেয়ে বড় কারণ।",
  ],
};

export const LEVEL_DIAGNOSIS_SUFFIX: Record<LevelId, string> = {
  chill: "তবে চিন্তা নেই, আপনার শান্তির level দেখে বাকিরা অবাক।",
  minor: "এখনো control-এ আছে, কিন্তু Mapun নজর রাখছে।",
  gorom: "মাথা থেকে হালকা ধোঁয়া বের হচ্ছে। ফ্যান full speed-এ দেন।",
  jhamela: "Brain-এর cooling fan এখন helicopter-এর মতো আওয়াজ করছে।",
  emergency: "Mapun Clinic-এর সব doctor এখন আপনার file নিয়ে emergency meeting করছে।",
};

export const PREDICTIONS: Record<LevelId, string[]> = {
  chill: [
    "আগামী ৭ দিনে আপনি অন্তত ৩ জনকে \"chill কর\" বলবেন।",
    "Future-এ আপনি সবার free therapist হবেন।",
  ],
  minor: [
    "আগামী সপ্তাহে একটা ছোট tension আসবে, আপনি চা দিয়ে তাকে হারাবেন।",
    "আপনার tension আগামী মাসে premium version-এ upgrade হতে পারে। সাবধান।",
  ],
  gorom: [
    "আগামী ৪৮ ঘণ্টায় আপনি অন্তত একবার জোরে \"ধুর!\" বলবেন।",
    "খুব শীঘ্রই আপনার মাথা থেকে ধোঁয়া বের হবে। Fire service-কে জানানো হয়েছে।",
  ],
  jhamela: [
    "আগামী সপ্তাহে আপনার phone battery আর patience একসাথে শেষ হবে।",
    "খুব শীঘ্রই আপনি \"সব ছেড়ে গ্রামে চলে যাবো\" বলবেন। যাবেন না, গ্রামেও WiFi নেই।",
  ],
  emergency: [
    "আগামীকাল Monday. এর বেশি কিছু বলার নেই।",
    "আপনার future আপনার phone battery-র মতো: ৩%, আর charger খুঁজে পাওয়া যাচ্ছে না।",
  ],
};

export const SHARE_JOKES = [
  "আমার tension দেখে calculator-ও resign দিয়েছে।",
  "Mapun বলছে আমি cooked। তুমি কতটা?",
  "আমার brain-এ ৪৭টা tab open। তোমার কয়টা?",
  "Doctor Mapun আমাকে Chillax 500mg দিয়েছে।",
  "আমার future আমাকে block করেছে। তোমাকে?",
];

export const PROGRESS_LABELS = [
  "Brain Loading...",
  "Tension Increasing...",
  "Situation Getting Worse...",
  "Mapun Calculating...",
];

export const SCAN_LINES = [
  "Boss-এর unread message scan করা হচ্ছে...",
  "Seen-zone-এর গভীরতা মাপা হচ্ছে...",
  "বিকাশ balance দেখে চোখ বন্ধ করা হচ্ছে...",
  "মাথার Chrome tab গোনা হচ্ছে...",
  "Overthinking-এর ধোঁয়া analyze করা হচ্ছে...",
  "Calculator-কে শান্ত করা হচ্ছে...",
];

export interface RandomTension {
  tag: string;
  text: string;
}

/** Wheel segments, in display order. Every tag below must have at least one tension. */
export const WHEEL_TAGS = ["Boss", "Ex", "টাকা", "Monday", "Family", "Tech", "Crush", "Life"] as const;

export const RANDOM_TENSIONS: RandomTension[] = [
  { tag: "Tech", text: "আপনার WiFi router আপনাকে secretly hate করে।" },
  { tag: "Life", text: "আপনার future আপনাকে block করে দিয়েছে।" },
  { tag: "Boss", text: "আপনার Boss এখন আপনার LinkedIn profile দেখছে।" },
  { tag: "টাকা", text: "আপনার bank account আপনাকে চিনতে পারছে না।" },
  { tag: "Ex", text: "আপনার Ex আপনার চেয়ে ভালো আছে। Probably." },
  { tag: "Monday", text: "আগামীকাল Monday." },
  { tag: "Tech", text: "আপনার phone battery আপনার future-এর মতোই low." },
  { tag: "Family", text: "পাশের বাসার আন্টি আপনার result জেনে গেছে।" },
  { tag: "টাকা", text: "প্রিয় চায়ের দোকান বাকির খাতা খুলেছে। প্রথম পাতায় আপনার নাম।" },
  { tag: "Ex", text: "আপনার Netflix password এখন আপনার Ex-এর নতুন partner ব্যবহার করছে।" },
  { tag: "Life", text: "গতকাল যে message-এ \"😂\" দিয়েছিলেন, সেটা আসলে sad news ছিল।" },
  { tag: "Tech", text: "Mobile data শেষ, আর WiFi-এর password কেউ মনে রাখেনি।" },
  { tag: "Family", text: "আম্মু আপনার phone-এর search history দেখার plan করছেন।" },
  { tag: "টাকা", text: "Rickshaw মামার কাছে ভাংতি নেই, আর আপনার কাছে শুধু ১০০০ টাকার নোট।" },
  { tag: "Family", text: "ঈদের নতুন জামা তিনজন কাজিন হুবহু একই রকম কিনেছে।" },
  { tag: "Boss", text: "Boss \"Quick call?\" পাঠিয়েছে। রাত ১১টায়।" },
  { tag: "Crush", text: "আপনি crush-এর ৩ বছর আগের profile picture-এ ভুল করে like দিয়ে ফেলেছেন।" },
  { tag: "Tech", text: "Laptop update নিচ্ছে, ২ ঘণ্টা বাকি। Presentation ১০ মিনিট পরে।" },
  { tag: "টাকা", text: "বিকাশে ৳১২ আছে, আর cash-out charge ৳১৮।" },
  { tag: "Life", text: "বন্ধু বলেছে \"ভাই, একটা কথা ছিল\"। তারপর offline।" },
  { tag: "Monday", text: "Load shedding শুরু, phone-এ ৪% charge, আর কালকে Monday।" },
  { tag: "Crush", text: "Crush আপনার story দেখেছে। ৩ সেকেন্ড পরে আপনার বন্ধুর story-তে heart দিয়েছে।" },
  { tag: "Boss", text: "Boss আপনার \"অসুস্থ\" ছুটির দিনের Cox's Bazar-এর ছবি দেখে ফেলেছে।" },
  { tag: "Monday", text: "আপনার weekend মাত্র শুরু হলো। আর... এটা আসলে Sunday রাত।" },
  { tag: "Ex", text: "আপনার Ex আপনাকে নতুন একটা business-এর \"opportunity\" দিতে message করেছে।" },
  { tag: "Crush", text: "Crush \"ভাইয়া\" বলে ডেকেছে।" },
  { tag: "Life", text: "Shower-এর মাঝখানে পানি চলে গেছে। মাথায় শ্যাম্পু।" },
  { tag: "Family", text: "আপনার নাম family group-এ আলোচনা হচ্ছে, কিন্তু আপনাকে group-এ add করা নেই।" },
];

export const MEGA_TENSIONS = [
  "Monday + Load shedding + Boss-এর call + বিকাশে ৳০। একসাথে।",
  "আপনার Ex আপনার Boss-কে বিয়ে করছে, আর আপনি invited।",
  "আপনার আম্মু আপনার Ex-এর আম্মুর best friend হয়ে গেছে।",
  "আপনার resignation draft ভুল করে company-wide email-এ চলে গেছে। Reply-all চলছে।",
  "আপনার পুরো search history এখন family WhatsApp group-এর pinned message।",
  "সরকারি ঘোষণা: আজ থেকে প্রতিদিন Monday।",
  "Boss আপনার পাশের flat-এ উঠেছে। বারান্দা মুখোমুখি।",
  "Crush আপনার কাজিনের সাথে relationship-এ, আর এই ঈদে সবাই আপনার বাসায়।",
];

export const MICROCOPY = {
  notFound: "ভাই, এই page-ও tension নিয়ে পালিয়ে গেছে!",
  loading: "আপনার সমস্যা বুঝতে আমাদেরও একটু সময় লাগছে...",
  networkError: "Internet-ও আপনার situation দেখে disconnect হয়ে গেছে!",
  empty: "এখানে কিছু নেই। আপনার মতোই শান্তি নেই।",
  retake: "আরেকটু tension নেবেন?",
  confirm: "আপনি কি নিশ্চিত? আপনার brain কিন্তু already tired!",
  disclaimer:
    "এই score সম্পূর্ণ কাল্পনিক এবং বিনোদনের জন্য তৈরি। এটি কোনো বাস্তব মানসিক স্বাস্থ্য মূল্যায়ন নয়।",
  realHelp: "সত্যিই মন খারাপ থাকলে কাছের কারো সাথে কথা বলুন বা professional সাহায্য নিন। Mapun শুধু হাসাতে পারে।",
};
