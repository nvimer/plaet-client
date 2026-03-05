export function formatCurrency(value: number | string, currency = "COP"): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  
  if (isNaN(num)) return "$0";
  
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatNumber(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  
  if (isNaN(num)) return "0";
  
  return new Intl.NumberFormat("es-CO").format(num);
}
