export function getNextThursday(baseDate = new Date()) {
  const date = new Date(baseDate);
  const day = date.getDay(); // 0 = domingo, 2 = terça, 4 = quinta

  const daysUntilThursday = (4 + 7 - day) % 7 || 7;

  date.setDate(date.getDate() + daysUntilThursday);
  date.setHours(21, 0, 0, 0); // 20:00

  return date;
}
