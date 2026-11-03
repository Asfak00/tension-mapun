import type { Metadata } from "next";
import { SalaryCalculator } from "@/components/tools/SalaryCalculator";

export const metadata: Metadata = { title: "Salary Survival Calculator", description: "Salary দিয়ে মাসের কয় তারিখ পর্যন্ত টিকবেন? মজার (এবং সরল) হিসাব।" };

export default function SalaryCalculatorPage() {
  return <SalaryCalculator />;
}
