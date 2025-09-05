export type Point = { x: number; y: number };
export function polygonArea(points: Point[]): number {
  if (!points || points.length < 3) return 0;
  let sum = 0;
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    sum += a.x * b.y - a.y * b.x;
  }
  return Math.abs(sum) / 2;
}
