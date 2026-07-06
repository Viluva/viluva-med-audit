import { ImageResponse } from "next/og";

export const alt = "Viluva — Know the real worth, before you decide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#faf9f6",
          backgroundImage:
            "radial-gradient(ellipse 70% 60% at 20% 10%, rgba(99,102,241,0.20), transparent 60%), radial-gradient(ellipse 60% 55% at 85% 20%, rgba(139,92,246,0.18), transparent 60%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 900,
              color: "#ffffff",
            }}
          >
            V
          </div>
          <div style={{ fontSize: 40, fontWeight: 900, color: "#0b1120" }}>
            Viluva
          </div>
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "#0b1120",
            textAlign: "center",
            lineHeight: 1.1,
            maxWidth: 980,
            letterSpacing: "-0.02em",
          }}
        >
          Know the real worth
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            backgroundImage: "linear-gradient(90deg, #4f46e5, #7c3aed)",
            backgroundClip: "text",
            color: "transparent",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 28,
          }}
        >
          before you decide
        </div>
        <div style={{ fontSize: 28, color: "#475569", textAlign: "center" }}>
          Free calculators for retirement, investing, loans &amp; everyday spending
        </div>
      </div>
    ),
    { ...size }
  );
}
