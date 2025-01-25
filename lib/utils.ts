export const formatedate = (dateValue: string) => {
  const date = new Date(dateValue);

  const formattedDate = date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  return formattedDate
};

export default function joinClasses(
  ...args: Array<string | boolean | null | undefined>
) {
  return args.filter(Boolean).join(' ');
}


export function formatNumber(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}