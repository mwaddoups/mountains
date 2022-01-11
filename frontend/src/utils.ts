import dateFormat from "dateformat";

export function describe_date(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);

  if (date.getFullYear() === now.getFullYear()) {
    const nearFormat = dateFormat(date, 'DDDD, mmm d')
    const farFormat = dateFormat(date, 'dddd, mmm d')
    if (nearFormat !== farFormat) {
      // This means that its today or yesterday or tomorrow
      return dateFormat(date, 'DDDD, HH:MM');
    } else {
      return dateFormat(date, 'mmm d, HH:MM');
    }
  } else {
    return dateFormat(date, 'mmm d, yyyy, HH:MM')
  }
}