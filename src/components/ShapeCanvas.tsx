"use client";

import React, { useEffect, useMemo, useRef, useState, MouseEvent, useCallback } from "react";

type Pt = { x: number; y: number };

type Props = {
  unitLabel: string;
  cellLengthInMeters: number;
  onArea?: (areaPx2: number, areaM2: number) => void;
};

export default function ShapeCanvas({ unitLabel, cellLengthInMeters, onArea }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pts, setPts] = useState<Pt[]>([]);
  const [closed, setClosed] = useState(false);

  const cell = 20;
  const dpr = typeof window !== "undefined" ? (window.devicePixelRatio ?? 1) : 1;

  const px2ToM2 = useMemo(() => {
    const pxToMeter = cellLengthInMeters / cell;
    return pxToMeter * pxToMeter;
  }, [cellLengthInMeters]);

  function areaSigned(p: Pt[]): number {
    let s = 0;
    for (let i = 0; i < p.length; i++) {
      const a = p[i],
        b = p[(i + 1) % p.length];
      s += a.x * b.y - b.x * a.y;
    }
    return s / 2;
  }

  function toCanvasCoords(e: MouseEvent<HTMLCanvasElement>): Pt {
    const el = canvasRef.current!;
    const rect = el.getBoundingClientRect();
    const sx = el.width / rect.width;
    const sy = el.height / rect.height;
    return {
      x: (e.clientX - rect.left) * sx,
      y: (e.clientY - rect.top) * sy,
    };
  }

  // >>> draw memoizado: depende de pts/closed/dpr/cellLengthInMeters
  const draw = useCallback(() => {
    const el = canvasRef.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, el.width, el.height);

    // grid
    ctx.save();
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let x = 0; x <= el.width; x += cell * dpr) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, el.height);
      ctx.stroke();
    }
    for (let y = 0; y <= el.height; y += cell * dpr) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(el.width, y);
      ctx.stroke();
    }
    ctx.restore();

    // polígono + pontos
    if (pts.length) {
      ctx.save();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#6366f1";
      ctx.fillStyle = "rgba(99,102,241,0.08)";
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      if (closed) ctx.closePath();
      ctx.stroke();
      if (closed) ctx.fill();
      ctx.restore();

      ctx.fillStyle = "#1f2937";
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // legenda
    ctx.save();
    ctx.fillStyle = "#6b7280";
    ctx.font = `${12 * dpr}px system-ui, sans-serif`;
    ctx.fillText(`1 célula = ${cellLengthInMeters} ${unitLabel}`, 8 * dpr, 16 * dpr);
    ctx.restore();
  }, [pts, closed, dpr, cellLengthInMeters, unitLabel]);

  // inicializa canvas (tamanho) e desenha
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const w = 400,
      h = 260;
    el.width = Math.round(w * dpr);
    el.height = Math.round(h * dpr);
    el.style.width = `${w}px`;
    el.style.height = `${h}px`;
    draw();
  }, [dpr, draw]);

  // redesenha quando estado/dados mudarem
  useEffect(() => {
    draw();
  }, [draw]);

  function handleClick(e: MouseEvent<HTMLCanvasElement>) {
    if (closed) return;
    const p = toCanvasCoords(e);
    setPts((v) => [...v, p]);
  }

  function handleDblClick() {
    if (pts.length >= 3) {
      setClosed(true);
      const apx2 = Math.abs(areaSigned(pts));
      const am2 = apx2 * px2ToM2;
      onArea?.(apx2, am2);
    }
  }

  function undo() {
    if (closed) setClosed(false);
    else setPts((v) => v.slice(0, -1));
  }

  function clearAll() {
    setClosed(false);
    setPts([]);
    onArea?.(0, 0);
  }

  function calcNow() {
    if (pts.length >= 3) {
      const apx2 = Math.abs(areaSigned(pts));
      const am2 = apx2 * px2ToM2;
      onArea?.(apx2, am2);
      setClosed(true);
    }
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full rounded border border-slate-200 bg-white"
        onClick={handleClick}
        onDoubleClick={handleDblClick}
      />
      <div className="absolute right-2 top-2 flex gap-2">
        <button
          className="cursor-pointer rounded bg-indigo-600 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-700"
          onClick={calcNow}
        >
          Calcular
        </button>
        <button
          className="cursor-pointer rounded border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50"
          onClick={undo}
        >
          Desfazer
        </button>
        <button
          className="cursor-pointer rounded border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50"
          onClick={clearAll}
        >
          Limpar
        </button>
      </div>
    </div>
  );
}
