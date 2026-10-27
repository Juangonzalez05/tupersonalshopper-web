import { describe, expect, it } from "vitest";
import { formatCOP } from "./money";

describe("formatCOP", () => {
  it("usa punto como separador de miles", () => {
    expect(formatCOP(250_000)).toBe("$250.000");
    expect(formatCOP(1_234_567)).toBe("$1.234.567");
    expect(formatCOP(0)).toBe("$0");
    expect(formatCOP(999)).toBe("$999");
  });

  it("agrega el sufijo COP cuando se pide", () => {
    expect(formatCOP(155_000, { suffix: true })).toBe("$155.000 COP");
  });

  it("redondea a pesos enteros", () => {
    expect(formatCOP(1999.6)).toBe("$2.000");
  });
});
