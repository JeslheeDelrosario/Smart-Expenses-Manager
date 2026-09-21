import { useCallback } from "react";
import { usePreferences } from "./usePreferences";
import { formatCurrency as fmt } from "../lib/currency";

export function useCurrency() {
  const { preferences } = usePreferences();
  const currency = preferences.currency;

  const formatCurrency = useCallback(
    (amount: number) => fmt(amount, currency),
    [currency],
  );

  return { formatCurrency, currency };
}
