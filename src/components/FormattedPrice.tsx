"use client";

import { useCurrency } from "@/lib/CurrencyContext";

interface PriceProps {
  amount: number;
  className?: string;
}

export default function FormattedPrice({ amount, className = "" }: PriceProps) {
  const { formatPrice } = useCurrency();
  return <span className={className}>{formatPrice(amount)}</span>;
}
