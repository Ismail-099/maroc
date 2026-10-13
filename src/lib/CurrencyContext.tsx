"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Currency = "MAD" | "EUR" | "USD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (priceMAD: number) => string;
  convertPrice: (priceMAD: number) => number;
  symbol: string;
}

const RATES: Record<Currency, number> = {
  MAD: 1,
  EUR: 0.092, // ~ 1 MAD ≈ 0.092 EUR
  USD: 0.10,  // ~ 1 MAD ≈ 0.10 USD
};

const SYMBOLS: Record<Currency, string> = {
  MAD: "MAD",
  EUR: "€",
  USD: "$",
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("MAD");

  useEffect(() => {
    const saved = localStorage.getItem("artisanat_currency") as Currency | null;
    if (saved && ["MAD", "EUR", "USD"].includes(saved)) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem("artisanat_currency", c);
  };

  const convertPrice = (priceMAD: number) => {
    const rate = RATES[currency];
    const converted = priceMAD * rate;
    return currency === "MAD" ? Math.round(converted) : Math.round(converted * 100) / 100;
  };

  const formatPrice = (priceMAD: number) => {
    const amount = convertPrice(priceMAD);
    if (currency === "MAD") {
      return `${amount.toLocaleString("fr-MA")} MAD`;
    } else if (currency === "EUR") {
      return `${amount.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`;
    } else {
      return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        convertPrice,
        symbol: SYMBOLS[currency],
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
