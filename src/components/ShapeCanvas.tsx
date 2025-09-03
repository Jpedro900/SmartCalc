"use client";

import { useEffect, useRef, useState } from "react";

type P = { x: number; y: number };

export default function ShapeCanvas({
  onArea,
}: {
  onArea: (a: number) => void;
}) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const [pts, setPts] = useState<P[]>([]);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    draw();
    onArea(closed && pts.length >= 3 ? shoelace(pts) : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pts, closed]);

  function toCanvas(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>): P {
    const c = ref.current!;
    const r = c.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (closed) return;
    const p = toCanvas(e);
    setPts((v) => [...v, p]);
  }
  function handleDbl() {
    if (pts.length >= 3) setClosed(true);
  }
  function reset() {
    setPts([]);
    setClosed(false);
  }
  function undo() {
    if (closed) setClosed(false);
    setPts(v => v.slice(0, -1));
  }

  function draw() {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const W = c.width, H = c.height;

    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = "#eef2ff";
    ctx.lineWidth = 1;
    for (let x = 20; x < W; x += 20) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 20; y < H; y += 20) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    if (pts.length === 0) return;

    ctx.strokeStyle = "#6b7fd7";
    ctx.fillStyle = "rgba(105,123,215,0.12)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    if (closed) ctx.closePath();
    ctx.stroke();
    if (closed) ctx.fill();

    ctx.fillStyle = "#1e293b";
    for (const p of pts) {
      ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fill();
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <button
          onClick={undo}
          className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-1 text-sm hover:bg-slate-50"
          type="button"
        >
          Desfazer
        </button>
        <button
          onClick={reset}
          className="cursor-pointer rounded-md border border-slate-300 bg-white px-3 py-1 text-sm hover:bg-slate-50"
          type="button"
        >
          Limpar
        </button>
        {!closed && pts.length >= 3 && (
          <button
            onClick={() => setClosed(true)}
            className="cursor-pointer rounded-md border border-indigo-300 bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
            type="button"
          >
            Fechar polígono
          </button>
        )}
      </div>

      <div className="mt-3 rounded-lg border border-slate-200 bg-white">
        <canvas
          ref={ref}
          width={560}
          height={360}
          onClick={handleClick}
          onDoubleClick={handleDbl}
          className="block w-full cursor-crosshair rounded-lg"
        />
      </div>
    </div>
  );
}

function shoelace(pts: P[]) {
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    s += a.x * b.y - b.x * a.y;
  }
  return Math.abs(s / 2);
}
