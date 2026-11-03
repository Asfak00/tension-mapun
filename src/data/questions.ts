import type { CategoryId, Question, QuestionOption } from "@/types";

const o = (label: string, points: number, reaction: string, hint?: string): QuestionOption => ({
  label,
  points,
  reaction,
  hint,
});

/**
 * Question bank per category. Order inside each list matters: it defines
 * the quiz order and therefore the share code. Append new questions and options
 * at the end so old share links keep decoding to the same answers (max 10 options).
 */
export const QUESTIONS: Record<CategoryId, Question[]> = {
  job: [
    {
      id: "job-1",
      category: "job",
      text: "Boss কি আজকে আপনাকে \"একটু আসেন\" বলেছে?",
      options: [
        o("না, আজকে শান্তি", 10, "বাহ! আজকে আপনার দিন। Lottery কিনে ফেলেন।"),
        o("বলেছে, চা খাওয়াতে", 25, "Boss চা খাওয়ালে সাবধান, পেছনে project আসছে।"),
        o("বলেছে, এখনো যাইনি", 70, "যত দেরি করবেন, office-এ rumor তত বাড়বে।"),
        o("\"একটু আসেন... HR-ও আছে\"", 100, "ভাই, desk-এর গাছটা আজকেই বাসায় নিয়ে যান।"),
      ],
    },
    {
      id: "job-2",
      category: "job",
      text: "Monday কি আপনার কাছে একটা horror movie?",
      options: [
        o("না, Monday-কে ভালোবাসি", 0, "আপনি মানুষ না, আপনি একটা productivity app।"),
        o("Sunday রাত থেকেই trailer শুরু", 55, "Sunday-scaries premium subscription active।"),
        o("Full movie, sequel Tuesday-তে", 80, "আর Wednesday-তে director's cut।"),
        o("আমার জন্য প্রতিদিনই Monday", 100, "আপনার calendar-এ শুধু Monday লেখা।"),
      ],
    },
    {
      id: "job-3",
      category: "job",
      text: "Salary কি এখনো pending?",
      options: [
        o("না, ১ তারিখেই আসে", 5, "আপনার company-কে frame করে রাখেন।"),
        o("১০ তারিখের আগে আসে না", 45, "মাসের প্রথম ১০ দিন আপনি ধৈর্যের প্রতীক।"),
        o("\"এই সপ্তাহে হয়ে যাবে\" — ৩ সপ্তাহ ধরে", 80, "এই সপ্তাহটা কোন বছরের, সেটা কেউ বলেনি।"),
        o("Salary কী জিনিস?", 100, "আপনি job করছেন নাকি volunteer service?"),
      ],
    },
    {
      id: "job-4",
      category: "job",
      text: "অফিসের Teams notification দেখলেই ভয় লাগে?",
      options: [
        o("না, notification off রাখি", 15, "Genius move. HR জানলে অবশ্য অন্য কথা।"),
        o("একটু heartbeat বাড়ে", 45, "স্বাভাবিক। Boss-এর \"Hi\" একটা thriller।"),
        o("ঘুমের মধ্যেও Teams-এর আওয়াজ শুনি", 80, "আপনার subconscious-ও এখন office করে।"),
        o("\"Hi\" দেখেই resignation letter লিখি", 100, "Drafts-এ ২৩টা resignation letter, তাই না?"),
      ],
    },
  ],
  business: [
    {
      id: "biz-1",
      category: "business",
      text: "Customer order দিয়ে ফোন বন্ধ করে দিয়েছে?",
      options: [
        o("না, সবাই ভালো মানুষ", 5, "আপনার customer-রা কি অন্য গ্রহের?"),
        o("মাঝে মাঝে হয়", 40, "\"ভাইয়া parcel টা কালকে নিবো\" — classic।"),
        o("Delivery man এখন আমার therapist", 75, "উনি আপনার সব কষ্টের কথা জানেন।"),
        o("COD মানে Cancel On Delivery", 100, "এটা business না, একটা social experiment।"),
      ],
    },
    {
      id: "biz-2",
      category: "business",
      text: "Supplier payment চাইছে?",
      options: [
        o("না, সব clear", 5, "আপনি কি business জগতের unicorn?"),
        o("\"ভাই, একটু দেখেন\" message আসছে", 45, "এটা এখনো polite reminder। এখনো।"),
        o("Call দেখলে ফোন উল্টে রাখি", 80, "ফোন উল্টালে supplier উল্টাবে না, ভাই।"),
        o("Supplier দোকানের সামনে বসে আছে", 100, "উনাকে অন্তত এক কাপ চা দেন।"),
      ],
    },
    {
      id: "biz-3",
      category: "business",
      text: "Sales-এর graph কেমন?",
      options: [
        o("উপরের দিকে", 0, "Screenshot নিয়ে LinkedIn-এ দেন, ভাই।"),
        o("Flat, একদম straight line", 50, "Business-এর heartbeat নেই, আপনার আছে। আপাতত।"),
        o("নিচের দিকে, slide-এর মতো", 80, "Graph এখন playground-এ slide খেলতেছে।"),
        o("Graph-ও আমাকে ছেড়ে চলে গেছে", 100, "Excel খুললেই \"Are you sure?\" দেখায়।"),
      ],
    },
    {
      id: "biz-4",
      category: "business",
      text: "Bank balance দেখে কী করেন?",
      options: [
        o("হাসি", 10, "কোন bank? আমাদেরও একটা account খুলে দেন।"),
        o("Refresh করি, যদি বাড়ে", 50, "Refresh button কোনো investor না।"),
        o("Calculator বন্ধ করে দিই", 80, "Calculator-ও আপনার পক্ষে কথা বলতে পারতেছে না।"),
        o("App-এ fingerprint দিতে ভয় লাগে", 100, "আঙুলও সত্যটা জানতে চায় না।"),
      ],
    },
  ],
  relationship: [
    {
      id: "rel-1",
      category: "relationship",
      text: "উনি (GF/BF/Crush) reply দিতে কত দেরি করে?",
      options: [
        o("১ মিনিট", 10, "আপনি lucky। এই relationship-টা museum-এ রাখা দরকার।", "এখনো hope আছে"),
        o("১০ মিনিট", 35, "১০ মিনিটে আপনি ৪টা theory বানিয়ে ফেলেছেন।", "সন্দেহ শুরু"),
        o("১ ঘণ্টা", 60, "উনার last seen এর screenshot evidence হিসেবে জমা হচ্ছে।", "তদন্ত চলছে"),
        o("১ দিন", 85, "একদিন? ভাই, এর মধ্যে মানুষ বিয়ে করে ফেলে।", "ভাই, move on"),
        o("Seen দিয়ে গেছে", 100, "Seen। শুধু seen। নীল দুইটা tick, আর আপনার হৃদয় ভাঙা।", "RIP"),
        o("আমার GF/BF নাই", 20, "Single life: কোনো seen নাই, কোনো tension নাই। শুধু বিয়ের দাওয়াতে একা যাওয়া।", "Reply-র অপেক্ষাও নাই"),
      ],
    },
    {
      id: "rel-2",
      category: "relationship",
      text: "Online আছে, কিন্তু reply নেই?",
      options: [
        o("না, সবসময় reply দেয়", 5, "এই relationship-এর রেসিপি আমাদের শেয়ার করেন।"),
        o("মাঝে মাঝে, busy হয়তো", 40, "\"Busy\" — এই শব্দটা আপনি নিজেকে বোঝাচ্ছেন।"),
        o("Active now, কিন্তু আমার জন্য না", 80, "সবুজ বাতি জ্বলে, আপনার মনে লাল বাতি।"),
        o("আমাকে দেখে offline হয়ে যায়", 100, "আপনি কি ভুল WiFi password?"),
        o("Online থাকার মতো কেউই নাই", 15, "Online থাকার মানুষ নাই, তাই offline হওয়ার দুঃখও নাই। Smart."),
      ],
    },
    {
      id: "rel-3",
      category: "relationship",
      text: "\"আমাদের একটু কথা বলা দরকার\" শুনেছেন?",
      options: [
        o("না, কখনো না", 5, "আলহামদুলিল্লাহ। এই বাক্য nuclear code-এর চেয়েও ভয়ংকর।"),
        o("শুনেছি, পরে দেখি pizza নিয়ে কথা", 30, "হার্ট অ্যাটাক থেকে অল্পের জন্য বাঁচলেন।"),
        o("শুনেছি, এখনো \"কথা\" হয়নি", 85, "এই অপেক্ষা Netflix-এর season break-এর চেয়েও কষ্টের।"),
        o("শুনেছি, তারপর থেকে single", 100, "ওই বাক্যটা আসলে একটা trailer ছিল।"),
        o("এই কথা বলার মতো কেউই নাই", 20, "\"কথা বলা দরকার\" বলার মানুষ একজনই আছে: আম্মু।"),
      ],
    },
    {
      id: "rel-4",
      category: "relationship",
      text: "Ex-এর profile এখনো bookmarked?",
      options: [
        o("Ex কী? আমি free bird", 0, "আপনি এই section-এ কী করছেন, ভাই?"),
        o("না, কিন্তু নাম মুখস্থ", 45, "Search bar-এ দুই অক্ষর দিলেই নাম চলে আসে, তাই না?"),
        o("মাঝে মাঝে দেখি, research purpose", 75, "Research-এর result: উনি আপনার চেয়ে ভালো আছে।"),
        o("Ex-এর বিয়ের ছবিতে like দিয়ে ফেলেছি", 100, "ভাই... ভাই... ভাই..."),
        o("জীবনে কেউ আসেই নাই, Ex আসবে কোথা থেকে", 25, "Ex নাই, crush আছে, আর crush জানেই না। Classic."),
      ],
    },
  ],
  money: [
    {
      id: "money-1",
      category: "money",
      text: "মাসের কত তারিখেই টাকা শেষ?",
      options: [
        o("শেষ হয় না, save করি", 0, "আপনি কি কোনো দেশের অর্থমন্ত্রী?"),
        o("২৫ তারিখের পর", 35, "শেষ ৫ দিন ডিম-ভাত diet।"),
        o("১৫ তারিখের মধ্যে", 70, "মাসের বাকি অর্ধেক motivational video দেখে চলেন।"),
        o("Salary আসার দিনই", 100, "টাকা আসে আর যায়, আপনি শুধু notification দেখেন।"),
      ],
    },
    {
      id: "money-2",
      category: "money",
      text: "বন্ধু টাকা ধার নিয়ে ফেরত দেয়নি?",
      options: [
        o("আমি ধার দিই না", 10, "Smart. বন্ধুত্বও বাঁচল, টাকাও।"),
        o("দিবে বলেছে, \"কালকে\"", 50, "এই \"কালকে\" কখনো আসে না, Monday-র মতো রয়ে যায়।"),
        o("ধার চাইলে এখন আমাকে avoid করে", 80, "টাকা গেছে, বন্ধুও গেছে। Combo offer।"),
        o("উল্টো আমিই এখন ওর কাছে ধার চাই", 95, "Circle of debt সম্পূর্ণ।"),
      ],
    },
    {
      id: "money-3",
      category: "money",
      text: "বিকাশ balance check করতে ভয় লাগে?",
      options: [
        o("না, balance healthy", 5, "আপনার বিকাশ থেকে হাসির শব্দ আসে।"),
        o("একটু ভয় লাগে", 45, "\"Your balance is\" এর পরের অংশটা slow motion-এ দেখেন।"),
        o("চোখ বন্ধ করে check করি", 75, "Balance দেখার আগে দোয়া পড়া হয়।"),
        o("Balance ৳৩৭.৫০, cash-out charge বেশি", 100, "এই টাকায় একটা সিঙ্গারা আর দুইটা দুঃখ কেনা যায়।"),
      ],
    },
    {
      id: "money-4",
      category: "money",
      text: "EMI / loan-এর অবস্থা?",
      options: [
        o("কোনো loan নেই", 0, "আপনার শান্তি দেখে bank-ও হিংসা করে।"),
        o("একটা EMI চলে", 45, "মাসের ১ তারিখে EMI আপনার আগে salary খায়।"),
        o("EMI দিতে আরেকটা loan নিয়েছি", 85, "Loan-ception। Nolan জানলে movie বানাবে।"),
        o("Bank এখন আমাকে নাম ধরে ডাকে", 100, "Bank-এর ভাইয়া আপনার birthday-ও জানে।"),
      ],
    },
  ],
  study: [
    {
      id: "study-1",
      category: "study",
      text: "Exam কবে?",
      options: [
        o("Exam নেই, শান্তি", 0, "আপনার সাথে একটা ছবি তোলা দরকার।"),
        o("এক মাস পরে", 35, "\"এখনো অনেক সময় আছে\" — বিখ্যাত শেষ কথা।"),
        o("কালকে", 80, "আজ রাতের playlist: \"1 night before exam\"।"),
        o("আজকে, আমি hall-এর সামনে", 100, "ভাই, quiz বন্ধ করেন, বই খোলেন!"),
      ],
    },
    {
      id: "study-2",
      category: "study",
      text: "পড়ার অবস্থা কী?",
      options: [
        o("Syllabus শেষ, revision চলছে", 5, "আপনি topper। চলে যান, আমাদের insecure লাগছে।"),
        o("অর্ধেক হয়েছে", 45, "অর্ধেক পড়া মানে অর্ধেক সাহস।"),
        o("বইয়ের cover দেখেছি", 80, "লেখকের নামটা অন্তত মুখস্থ করেন।"),
        o("Syllabus কোথায় পাওয়া যায়?", 100, "ভাই, আপনি তো পুরাই cooked!"),
      ],
    },
    {
      id: "study-3",
      category: "study",
      text: "Assignment pending কয়টা?",
      options: [
        o("০টা", 5, "আপনি কি AI? সত্যি করে বলেন।"),
        o("১-২টা", 40, "Deadline-এর আগের রাতে হয়ে যাবে। হয়তো।"),
        o("৫টার বেশি", 80, "Assignment-গুলো এখন নিজেরাই group study করে।"),
        o("গুনতে ভয় লাগে", 100, "Teacher-এর email দেখলেই phone airplane mode।"),
      ],
    },
    {
      id: "study-4",
      category: "study",
      text: "Result নিয়ে কী feel করেন?",
      options: [
        o("Chill, যা হবে হবে", 10, "Stoic philosopher detected।"),
        o("একটু টেনশন", 45, "Result-এর দিন সকাল থেকে বাথরুম trip বাড়ে।"),
        o("Website-এ ঢুকতে হাত কাঁপে", 80, "Roll number লিখতে ৩ বার ভুল হয়।"),
        o("আব্বু-আম্মুর আগে কীভাবে দেখবো, সেটাই চিন্তা", 100, "Family WhatsApp group-এ আজকে ভূমিকম্প।"),
      ],
    },
  ],
  family: [
    {
      id: "fam-1",
      category: "family",
      text: "\"বিয়ে কবে করবা?\" কতবার শুনেছেন?",
      options: [
        o("কখনো না", 5, "আপনার family-কে national award দেওয়া দরকার।"),
        o("ঈদে একবার", 40, "বছরে দুই ঈদ, দুইবার interview।"),
        o("প্রতি সপ্তাহে", 75, "আম্মু এখন matrimonial site-এর premium member।"),
        o("Biodata ছাপা হয়ে গেছে", 100, "আপনার ছবি এখন খালার WhatsApp status-এ।"),
      ],
    },
    {
      id: "fam-2",
      category: "family",
      text: "আত্মীয়রা কি আপনার result/salary জিজ্ঞেস করে?",
      options: [
        o("না, সবাই ভদ্র", 5, "আপনার আত্মীয়রা কি fictional?"),
        o("মাঝে মাঝে", 40, "\"তোমার কাজিন তো এবার...\" — শুরু হলো।"),
        o("প্রতিটা দাওয়াতে", 80, "দাওয়াতে খাবারের আগে আপনার CV review হয়।"),
        o("পাশের বাসার আন্টিও জানে", 100, "আপনার জীবন এখন neighborhood-এর live broadcast।"),
      ],
    },
    {
      id: "fam-3",
      category: "family",
      text: "Parents-এর expectation level?",
      options: [
        o("\"সুস্থ থাকো, এটাই যথেষ্ট\"", 5, "এই parents-দের clone করা দরকার।"),
        o("\"ভালো একটা job হলেই হবে\"", 45, "\"ভালো\"-এর definition প্রতি বছর update হয়।"),
        o("\"ডাক্তার, engineer, নাহলে BCS\"", 80, "Option D: Mapun-এর CEO? চলবে?"),
        o("\"Sharmin-এর ছেলে তো NASA-তে\"", 100, "Sharmin আন্টির ছেলে একটা myth, ভাই।"),
      ],
    },
    {
      id: "fam-4",
      category: "family",
      text: "Family WhatsApp group-এ কী চলে?",
      options: [
        o("শুধু \"শুভ সকাল\"", 10, "ফুলের ছবি আর শুভ সকাল — শান্তির প্রতীক।"),
        o("Forward করা health tips", 35, "\"রসুন খেলে সব রোগ ভালো\" — মামা।"),
        o("আমাকে নিয়ে discussion", 85, "আপনি group-এ আছেন, তারপরও।"),
        o("আমাকে remove করে দিয়েছে", 100, "এটা punishment নাকি মুক্তি?"),
      ],
    },
  ],
  social: [
    {
      id: "soc-1",
      category: "social",
      text: "Facebook খুললেই কী দেখেন?",
      options: [
        o("Meme, শুধু meme", 10, "Healthy diet।"),
        o("বন্ধুদের নতুন job-এর post", 60, "\"Excited to announce\" পড়লেই বুক ধড়ফড়।"),
        o("সবার বিয়ের ছবি", 80, "আপনার feed এখন একটা wedding album।"),
        o("সবার বিদেশে settle হওয়ার check-in", 100, "আর আপনি এখনো মিরপুর ১০-এ জ্যামে।"),
      ],
    },
    {
      id: "soc-2",
      category: "social",
      text: "বন্ধুদের সাথে নিজেকে compare করেন?",
      options: [
        o("না, নিজের life নিজের", 5, "Zen master আপনি।"),
        o("মাঝে মাঝে", 45, "বিশেষ করে রাত ২টায়।"),
        o("প্রতিদিন, LinkedIn খুলে", 80, "LinkedIn আপনার জন্য horror app।"),
        o("School-এর backbencher এখন CEO", 100, "আর আপনি এখনো \"Open to work\" frame নিয়ে বসে আছেন।"),
      ],
    },
    {
      id: "soc-3",
      category: "social",
      text: "দৈনিক screen time কত?",
      options: [
        o("২ ঘণ্টার কম", 5, "আপনার thumb বিশ্রামে আছে।"),
        o("৪-৬ ঘণ্টা", 45, "স্বাভাবিক বাংলাদেশি।"),
        o("৮+ ঘণ্টা", 80, "Phone আপনাকে ব্যবহার করছে।"),
        o("Weekly report দেখে phone নিজেই লজ্জা পায়", 100, "আপনার thumb-এর gym membership লাগবে।"),
      ],
    },
    {
      id: "soc-4",
      category: "social",
      text: "কোনো plan-এ invite না পেলে?",
      options: [
        o("যাই হোক, ঘুমাই", 5, "ঘুম > plan। Respect।"),
        o("Story দেখে একটু খারাপ লাগে", 45, "Story আবার replay করে দেখেন, তাই না?"),
        o("\"আমাকে ডাকলি না?\" লিখে delete করি", 80, "Drafts-এ অনেক অভিমান জমা।"),
        o("নিজেই নিজের জন্য party দিই, একা", 95, "Main character energy, কিন্তু budget কম।"),
      ],
    },
  ],
  future: [
    {
      id: "fut-1",
      category: "future",
      text: "৫ বছর পরে নিজেকে কোথায় দেখেন?",
      options: [
        o("Clear plan আছে", 5, "আপনার vision board দেখে আমাদের হিংসা লাগছে।"),
        o("মোটামুটি একটা idea আছে", 40, "\"মোটামুটি\" মানে \"দেখা যাক\"।"),
        o("আজকের দুপুরের খাবারই ঠিক করিনি", 80, "Future plan: ভাত।"),
        o("Future আমাকে block করে দিয়েছে", 100, "Unblock request pending।"),
      ],
    },
    {
      id: "fut-2",
      category: "future",
      text: "রাতে ঘুমানোর আগে কী ভাবেন?",
      options: [
        o("কিছু না, ঘুমিয়ে পড়ি", 0, "আপনার ঘুম দেখে বাকিরা জ্বলে।"),
        o("কালকের কাজ", 35, "Productive overthinking।"),
        o("২০১৪ সালে বলা একটা লজ্জার কথা", 80, "কথাটা কেউ মনে রাখেনি, আপনি ছাড়া।"),
        o("জীবনের মানে, মহাবিশ্ব, আর EMI", 100, "রাত ৩টার philosopher।"),
      ],
    },
    {
      id: "fut-3",
      category: "future",
      text: "Career নিয়ে কতটা confused?",
      options: [
        o("একদম না", 5, "আপনি কি LinkedIn influencer?"),
        o("একটু, option অনেক", 40, "Option বেশি, decision কম।"),
        o("প্রতি সপ্তাহে নতুন career plan", 80, "এই সপ্তাহ: YouTuber। গত সপ্তাহ: Dropshipping।"),
        o("গ্রামে গিয়ে গরুর farm দিবো", 95, "প্রতিটা বাংলাদেশি জীবনে একবার এটা ভাবে।"),
      ],
    },
    {
      id: "fut-4",
      category: "future",
      text: "Future নিয়ে Google-এ শেষ কী search করেছেন?",
      options: [
        o("কিছু না", 10, "Google আপনাকে miss করে।"),
        o("\"best career for me\"", 50, "Google-ও জানে না, ভাই।"),
        o("\"how to be successful at 25\"", 75, "Result: ৬টা ad আর একটা paid course।"),
        o("\"Canada PR process\"", 100, "এই search history পুরো generation-এর।"),
      ],
    },
  ],
  random: [
    {
      id: "rnd-1",
      category: "random",
      text: "আজকের tension-এর ধরন কী?",
      options: [
        o("আসলে কোনো tension নেই, just vibing", 5, "তাহলে এখানে কী করেন? মজা নিতে? ঠিক আছে।"),
        o("নিজেও জানি না কী হয়েছে", 60, "Mystery tension। সবচেয়ে ভয়ংকর type।"),
        o("ঘুম থেকে উঠেই tension লাগে", 75, "আপনার alarm clock আপনার শত্রু।"),
        o("সব ঠিক আছে, তারপরও শান্তি নেই", 85, "এটাকে বলে Bangladeshi default mode।"),
      ],
    },
    {
      id: "rnd-2",
      category: "random",
      text: "আপনার মাথায় এখন কয়টা tab open?",
      options: [
        o("১টা, focus mode", 5, "Monk mode activated।"),
        o("১০টা", 40, "Average মানুষ।"),
        o("৪৭টা, ১২টা not responding", 85, "Task Manager খুলতেও সাহস নেই।"),
        o("সব tab-এ গান বাজছে, কোনটা জানি না", 100, "Brain-এর volume mixer নষ্ট।"),
      ],
    },
    {
      id: "rnd-3",
      category: "random",
      text: "Unknown number থেকে call আসলে?",
      options: [
        o("ধরি, কোনো সমস্যা নেই", 10, "সাহসী মানুষ।"),
        o("ধরার আগে Truecaller", 40, "Detective mode on।"),
        o("ধরি না, পরে number Google করি", 70, "নাম্বারটার পুরো history বের করে ফেলেন।"),
        o("মনে হয় পুলিশ, bank আর আম্মু একসাথে", 100, "Guilty conscience 100%।"),
      ],
    },
    {
      id: "rnd-4",
      category: "random",
      text: "সর্বশেষ কবে মন খুলে হেসেছেন?",
      options: [
        o("আজকেই", 5, "আপনার হাসির জন্য ধন্যবাদ।"),
        o("এই সপ্তাহে", 35, "ভালো আছেন, keep it up।"),
        o("এই quiz দেখে, এখন", 50, "মিশন সফল।"),
        o("মনে নেই", 75, "এখন একটু হাসেন, আমরা অপেক্ষা করছি।"),
      ],
    },
  ],
};

export const SKIP_REACTIONS = [
  "Skip করলেন? সন্দেহজনক...",
  "উত্তর দিতে ভয়? বুঝলাম, বুঝলাম।",
  "Skip-ও একটা উত্তর, ভাই। আমরা note করলাম।",
  "এই প্রশ্নটা আপনার জন্য personal হয়ে গেছে মনে হয়।",
];
