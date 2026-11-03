const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

export function toBn(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

/** Lakh-style grouping (1,00,000) with Bangla digits. */
export function formatTaka(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  const grouped = Math.round(Math.abs(amount)).toLocaleString("en-IN");
  return `${sign}৳${toBn(grouped)}`;
}
