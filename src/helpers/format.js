// Formaterar ett belopp till svenska kronor — t.ex. 2500 → "2 500 kr"
export function formatCurrency(amount) {
  return `${amount.toLocaleString('sv-SE')} kr`;
}
