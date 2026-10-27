import { describe, expect, it } from "vitest";
import { parseEnv } from "./env";

describe("parseEnv", () => {
  it("usa los datos oficiales cuando no hay variables", () => {
    expect(parseEnv({})).toEqual({
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
      NEXT_PUBLIC_WHATSAPP_NUMBER: "573239105182",
      NEXT_PUBLIC_INSTAGRAM_USER: "tushopperusa.co",
    });
  });

  it("trata una variable vacía como no definida", () => {
    expect(
      parseEnv({
        NEXT_PUBLIC_SITE_URL: "",
        NEXT_PUBLIC_WHATSAPP_NUMBER: "   ",
        NEXT_PUBLIC_INSTAGRAM_USER: "",
      }),
    ).toEqual(parseEnv({}));
  });

  it("limpia lo que se pega en el panel de Vercel", () => {
    const env = parseEnv({
      NEXT_PUBLIC_WHATSAPP_NUMBER: " +57 (300) 123-4567 ",
      NEXT_PUBLIC_INSTAGRAM_USER: "@otro.usuario",
      NEXT_PUBLIC_SITE_URL: "https://tushopperusa.com/",
    });
    expect(env.NEXT_PUBLIC_WHATSAPP_NUMBER).toBe("573001234567");
    expect(env.NEXT_PUBLIC_INSTAGRAM_USER).toBe("otro.usuario");
    expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://tushopperusa.com");
  });

  it("rechaza valores que no sirven", () => {
    expect(() => parseEnv({ NEXT_PUBLIC_WHATSAPP_NUMBER: "abc" })).toThrow();
    expect(() => parseEnv({ NEXT_PUBLIC_INSTAGRAM_USER: "con espacios" })).toThrow();
    expect(() => parseEnv({ NEXT_PUBLIC_SITE_URL: "no-es-una-url" })).toThrow();
  });
});
