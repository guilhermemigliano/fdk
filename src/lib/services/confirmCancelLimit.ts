function getBrazilDateParts(date: Date) {
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);

  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? '0';

  return {
    day: Number(get('day')),
    month: Number(get('month')),
    year: Number(get('year')),
    hour: Number(get('hour')),
    minute: Number(get('minute')),
  };
}

/**
 * ❗ Regra:
 * - Antes do dia da partida → PERMITIDO
 * - No dia da partida ATÉ 21:20 → PERMITIDO
 * - No dia da partida APÓS 21:20 → BLOQUEAR
 * - Após o dia da partida → BLOQUEAR
 */
export function hasMatchExpired(matchDate: Date) {
  const now = new Date();

  const nowBr = getBrazilDateParts(now);
  const matchBr = getBrazilDateParts(matchDate);

  // Se o dia atual já passou do dia do jogo → bloqueia
  const current = new Date(nowBr.year, nowBr.month - 1, nowBr.day);
  const match = new Date(matchBr.year, matchBr.month - 1, matchBr.day);

  if (current > match) return true; // já passou o dia → bloqueado

  // Se é antes do dia do jogo → permitido
  if (current < match) return false;

  // Se é o mesmo dia → verificar horário
  const isPast2120 =
    nowBr.hour > 21 || (nowBr.hour === 21 && nowBr.minute >= 20);

  return isPast2120;
}
