export default function addMonths(date: Date, months: number): Date {
  const newDate = new Date(date.valueOf());
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
}
