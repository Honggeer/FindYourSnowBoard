import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Find Your Own Snowboard | 找你的单板",
  description:
    "Smart snowboard recommendation tool. Enter your height, weight, riding style and budget to find your perfect board. 智能单板推荐，输入你的参数即可匹配。",
  keywords: "snowboard recommendation, find snowboard, 单板推荐, 雪板匹配",
  other: {
    "impact-site-verification": "63db3ec4-101c-458b-b97c-63e2b5800327",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen relative">
        <div className="mountain-bg" />
        <Snowflakes />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}

function Snowflakes() {
  const flakes = Array.from({ length: 20 }, (_, i) => ({
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${6 + Math.random() * 6}s`,
    size: `${6 + Math.random() * 8}px`,
  }));
  return (
    <div className="snowflakes">
      {flakes.map((f, i) => (
        <span
          key={i}
          className="snowflake"
          style={{
            left: f.left,
            animationDelay: f.delay,
            animationDuration: f.duration,
            fontSize: f.size,
          }}
        >
          ❄
        </span>
      ))}
    </div>
  );
}
