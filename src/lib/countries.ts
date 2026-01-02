// app/jogadores/novo/countries.ts
export const countries = [
  {
    label: '🇧🇷 Brasil',
    code: 'BR',
    dial: '+55',
    mask: '(99) 99999-9999',
    regex: /^\(\d{2}\)\s\d{5}-\d{4}$/,
  },
  {
    label: '🇺🇸 EUA',
    code: 'US',
    dial: '+1',
    mask: '(999) 999-9999',
    regex: /^\(\d{3}\)\s\d{3}-\d{4}$/,
  },
  {
    label: '🇨🇦 Canadá',
    code: 'CA',
    dial: '+1',
    mask: '(999) 999-9999',
    regex: /^\(\d{3}\)\s\d{3}-\d{4}$/,
  },
  {
    label: '🇵🇹 Portugal',
    code: 'PT',
    dial: '+351',
    mask: '999 999 999',
    regex: /^\d{3}\s\d{3}\s\d{3}$/,
  },
];
