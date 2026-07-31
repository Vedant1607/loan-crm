"use client";

import { useEffect, useState } from "react";

const BUILDINGS = [
  { x: 0,   w: 34, h: 90,  shade: "var(--color-brand-navy-light)" },
  { x: 40,  w: 34, h: 130, shade: "var(--color-brand-navy)" },
  { x: 80,  w: 34, h: 70,  shade: "var(--color-brand-navy-light)" },
  { x: 120, w: 34, h: 160, shade: "var(--color-brand-navy)" },
  { x: 160, w: 34, h: 110, shade: "var(--color-brand-navy-light)" },
  { x: 200, w: 34, h: 190, shade: "var(--color-brand-navy)" },
  { x: 240, w: 34, h: 140, shade: "var(--color-brand-navy-light)" },
  { x: 280, w: 34, h: 220, shade: "var(--color-brand-navy)" },
  { x: 320, w: 34, h: 170, shade: "var(--color-brand-navy-light)" },
  { x: 360, w: 34, h: 250, shade: "var(--color-brand-navy)" },
  { x: 400, w: 34, h: 200, shade: "var(--color-brand-navy-light)" },
];

const BASE_Y = 320;
const CHART_POINTS: [number, number][] = [
  [10, 300], [90, 260], [170, 275], [250, 190], [330, 150], [420, 70],
];

function pointsToPath(points: [number, number][]) {
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
}

export default function HeroChart() {
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDrawn(true);
      return;
    }
    const t = setTimeout(() => setDrawn(true), 250);
    return () => clearTimeout(t);
  }, []);

  const linePath = pointsToPath(CHART_POINTS);
  const lastPoint = CHART_POINTS[CHART_POINTS.length - 1];

  return (
    <svg
      viewBox="0 0 440 340"
      className="w-full h-auto max-w-md mx-auto"
      role="img"
      aria-label="Illustration of an ascending growth chart over a city skyline"
    >
      <line
        x1="0" y1={BASE_Y} x2="440" y2={BASE_Y}
        stroke="var(--color-brand-navy)" strokeOpacity="0.15" strokeWidth="1"
      />

      {BUILDINGS.map((b, i) => {
        return (
          <rect
            key={i}
            x={b.x}
            y={BASE_Y - b.h}
            width={b.w}
            height={b.h}
            fill={b.shade}
            fillOpacity={drawn ? 0.9 : 0}
            rx="1"
            style={{ transition: `fill-opacity 500ms ease ${i * 60}ms` }}
          />
        );
      })}

      <path
        d={linePath}
        fill="none"
        stroke="var(--color-brand-gold)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={drawn ? 0 : 1}
        style={{ transition: "stroke-dashoffset 1200ms ease 700ms" }}
      />

      {CHART_POINTS.map((point, i) => {
        const [x, y] = point;
        const isLast = i === CHART_POINTS.length - 1;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={isLast ? 5 : 3.5}
            fill="var(--color-brand-gold)"
            opacity={drawn ? 1 : 0}
            style={{ transition: `opacity 300ms ease ${900 + i * 120}ms` }}
          />
        );
      })}

      <path
        d={`M ${lastPoint[0] - 14} ${lastPoint[1] + 10} L ${lastPoint[0]} ${lastPoint[1]} L ${lastPoint[0] - 10} ${lastPoint[1] - 4}`}
        fill="none"
        stroke="var(--color-brand-gold)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={drawn ? 1 : 0}
        style={{ transition: "opacity 300ms ease 1500ms" }}
      />
    </svg>
  );
}