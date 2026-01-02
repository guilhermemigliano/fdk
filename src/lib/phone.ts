export function formatPhone(value: string, country: string) {
  const digits = value.replace(/\D/g, '');

  switch (country) {
    case 'BR': {
      // (11) 99999-9999
      return digits
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .slice(0, 15);
    }

    case 'US':
    case 'CA': {
      // (999) 999-9999
      return digits
        .replace(/^(\d{3})(\d)/, '($1) $2')
        .replace(/(\d{3})(\d)/, '$1-$2')
        .slice(0, 14);
    }

    case 'PT': {
      // 999 999 999
      return digits
        .replace(/^(\d{3})(\d)/, '$1 $2')
        .replace(/(\d{3})(\d)/, '$1 $2')
        .slice(0, 11);
    }

    default:
      return digits;
  }
}
