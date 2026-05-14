"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { TrustScoreHistory } from "@/lib/service/payment.service";

type TrustScoreGaugeProps = {
  score: number;
  histories: TrustScoreHistory[];
};

function buildSeries(score: number, histories: TrustScoreHistory[]) {
  const sorted = [...histories].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  const series =
    sorted.length > 0
      ? sorted
      : [{ score, createdAt: new Date().toISOString() }];

  const hasCurrent = Math.abs(series[series.length - 1].score - score) < 0.001;
  if (!hasCurrent) {
    series.push({ score, createdAt: new Date().toISOString() });
  }

  return series;
}

function chartPoints(series: TrustScoreHistory[]) {
  const min = Math.min(...series.map((item) => item.score));
  const max = Math.max(...series.map((item) => item.score));
  const range = Math.max(1, max - min);

  return series.map((item, index) => {
    const x = (index / Math.max(1, series.length - 1)) * 100;
    const y = 100 - ((item.score - min) / range) * 100;
    return `${x},${y}`;
  });
}

export function TrustScoreGauge({ score, histories }: TrustScoreGaugeProps) {
  const boundedScore = Math.max(0, Math.min(100, score));
  const [animatedScore, setAnimatedScore] = useState(0);
  const series = buildSeries(boundedScore, histories);
  const points = chartPoints(series);
  const polylinePoints = points.join(" ");
  const latestPoint = points[points.length - 1] || "100,50";

  useEffect(() => {
    let rafId = 0;
    let startTime = 0;
    const duration = 900;

    const step = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * boundedScore));

      if (progress < 1) {
        rafId = window.requestAnimationFrame(step);
      }
    };

    rafId = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(rafId);
  }, [boundedScore]);

  return (
    <div className="vp-card-soft w-full p-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.1em] text-ash-gray uppercase">
            Trust Score
          </p>
          <motion.p className="vp-stat-value mt-1 text-3xl font-semibold tracking-tight text-slate-text dark:text-slate-100">
            {animatedScore}/100
          </motion.p>
        </div>
        <span className="rounded-full border border-canvas-border px-2.5 py-1 text-xs font-medium text-ash-gray dark:text-slate-300">
          Verified
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-canvas-border p-3">
        <svg
          viewBox="0 0 100 100"
          className="h-20 w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polyline
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.18"
            strokeWidth="3"
            className="text-steel-gray"
            points={polylinePoints}
          />
          <motion.polyline
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-chartwell-blue"
            points={polylinePoints}
          />
          <circle
            cx={latestPoint.split(",")[0]}
            cy={latestPoint.split(",")[1]}
            r="3.6"
            className="fill-chartwell-blue"
          />
        </svg>

        <div className="mt-2 flex items-center justify-between text-[11px] vp-muted">
          <span>
            {series[0]
              ? new Date(series[0].createdAt).toLocaleDateString("en-NG", {
                  month: "short",
                  day: "numeric",
                })
              : "Start"}
          </span>
          <span>
            {series[series.length - 1]
              ? new Date(
                  series[series.length - 1].createdAt,
                ).toLocaleDateString("en-NG", {
                  month: "short",
                  day: "numeric",
                })
              : "Now"}
          </span>
        </div>
      </div>
    </div>
  );
}
