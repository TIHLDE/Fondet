import { ImageResponse } from "next/og";

export const alt = "TIHLDE Fondet";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand colours from src/styles/globals.css (dark theme).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#131722",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 40,
            fontWeight: 600,
            color: "#5e9eff",
            letterSpacing: 2,
          }}
        >
          TIHLDE
        </div>
        <div
          style={{
            fontSize: 110,
            fontWeight: 800,
            color: "#ffffff",
            marginTop: 8,
          }}
        >
          Fondet
        </div>
        <div
          style={{
            fontSize: 34,
            color: "#d1d4dc",
            marginTop: 24,
            maxWidth: 900,
          }}
        >
          Forvaltningsgruppen for TIHLDEs investeringsfond
        </div>
      </div>
    ),
    size,
  );
}
