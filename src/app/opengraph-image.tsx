import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name} · Personal shopper de Estados Unidos a Colombia`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logo = `data:image/png;base64,${await readFile(join(process.cwd(), "public/brand/logo-mark.png"), "base64")}`;

/** Imagen al compartir el sitio en WhatsApp, Instagram o Facebook. */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 64,
        padding: "0 88px",
        background: "#0B1431",
        color: "#FBFAF6",
        borderBottom: "6px solid #C5A253",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} width={340} height={340} alt="" />
      <div style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1 }}>
        <div
          style={{ fontSize: 22, letterSpacing: 6, color: "#C5A253", textTransform: "uppercase" }}
        >
          Personal shopper · EE. UU. a Colombia
        </div>
        <div style={{ fontSize: 58, lineHeight: 1.08 }}>
          Lo que te gusta de Estados Unidos, elegido para ti y enviado a Colombia.
        </div>
        <div style={{ fontSize: 26, color: "#C9CEDD" }}>Cotiza sin compromiso por WhatsApp</div>
      </div>
    </div>,
    size,
  );
}
