"use client";

import { useEffect, useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { addLine, removeLine, setLineQty, type CartLine, type NewCartLine } from "@/domain/cart";
import type { CustomerData } from "@/domain/schemas";

/** Copia de la última solicitud enviada, para la página de confirmación. */
export interface SentQuote {
  lines: CartLine[];
  customer: Omit<CustomerData, "consent">;
  whatsappUrl: string;
  sentAt: string;
}

interface CartState {
  lines: CartLine[];
  lastQuote: SentQuote | null;
  drawerOpen: boolean;
  add: (line: NewCartLine, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  /** Guarda la solicitud enviada y vacía la lista. */
  completeQuote: (quote: SentQuote) => void;
  setDrawerOpen: (open: boolean) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      lastQuote: null,
      drawerOpen: false,
      add: (line, qty = 1) => set((state) => ({ lines: addLine(state.lines, line, qty) })),
      setQty: (key, qty) => set((state) => ({ lines: setLineQty(state.lines, key, qty) })),
      remove: (key) => set((state) => ({ lines: removeLine(state.lines, key) })),
      completeQuote: (quote) => set({ lastQuote: quote, lines: [], drawerOpen: false }),
      setDrawerOpen: (drawerOpen) => set({ drawerOpen }),
    }),
    {
      name: "tushopperusa-pedido",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines, lastQuote: state.lastQuote }),
      // Se hidrata después de montar (CartHydrator) para que el HTML del servidor y el primer
      // render del navegador coincidan.
      skipHydration: true,
    },
  ),
);

let hydrated = false;

/** Montado una vez en el layout: lee localStorage y sincroniza entre pestañas. */
export function CartHydrator() {
  useEffect(() => {
    if (!hydrated) {
      hydrated = true;
      void useCart.persist.rehydrate();
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key === useCart.persist.getOptions().name) void useCart.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return null;
}

/** true cuando el pedido guardado ya se leyó; antes de eso se muestra el estado vacío. */
export function useCartHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useCart.persist.onFinishHydration(onChange),
    () => useCart.persist.hasHydrated(),
    () => false,
  );
}

/** Cantidad de productos distintos en el pedido (0 hasta hidratar). */
export function useCartCount(): number {
  const ready = useCartHydrated();
  const count = useCart((state) => state.lines.length);
  return ready ? count : 0;
}
