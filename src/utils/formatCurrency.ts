function formatCurrency(value: number) {
  return Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

export { formatCurrency };
