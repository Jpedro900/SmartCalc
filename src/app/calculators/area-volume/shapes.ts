/* eslint-disable @typescript-eslint/consistent-type-definitions */
export type Dim = "L" | "A" | "V";

export type Param = {
  id: string;
  label: string;
  dim: "L";
  hint?: string;
};

export type Inputs = Record<string, number>;

export type Shape2D = {
  id: string;
  name: string;
  params: Param[];
  area: (si: Inputs) => number;
  perimeter?: (si: Inputs) => number;
};

export type Shape3D = {
  id: string;
  name: string;
  params: Param[];
  volume: (si: Inputs) => number;
  surface?: (si: Inputs) => number;
};

/* ---------------- Grid/canvas ---------------- */

export const GRID_UNIT_LENGTH = 24;

/* ---------------- Unidades ------------------- */

export const LEN_UNITS = [
  { id: "mm", label: "Milímetro", symbol: "mm", toSI: (v: number) => v / 1000, fromSI: (m: number) => m * 1000 },
  { id: "cm", label: "Centímetro", symbol: "cm", toSI: (v: number) => v / 100, fromSI: (m: number) => m * 100 },
  { id: "m",  label: "Metro",      symbol: "m",  toSI: (v: number) => v,       fromSI: (m: number) => m },
  { id: "km", label: "Quilômetro", symbol: "km", toSI: (v: number) => v * 1000,fromSI: (m: number) => m / 1000 },

  { id: "in", label: "Polegada",   symbol: "in", toSI: (v: number) => v * 0.0254,      fromSI: (m: number) => m / 0.0254 },
  { id: "ft", label: "Pé",         symbol: "ft", toSI: (v: number) => v * 0.3048,      fromSI: (m: number) => m / 0.3048 },
  { id: "yd", label: "Jarda",      symbol: "yd", toSI: (v: number) => v * 0.9144,      fromSI: (m: number) => m / 0.9144 },
  { id: "mi", label: "Milha",      symbol: "mi", toSI: (v: number) => v * 1609.344,    fromSI: (m: number) => m / 1609.344 },
] as const;

export type LenId = (typeof LEN_UNITS)[number]["id"];

const findLen = (id: string) => LEN_UNITS.find(u => u.id === id) ?? LEN_UNITS[2]; // default "m"

export function lenToSI(lenId: string, v: number) {
  return findLen(lenId).toSI(v);
}
export function lenFromSI(lenId: string, m: number) {
  return findLen(lenId).fromSI(m);
}


export function areaUnit(lenId: string) {
  return `${findLen(lenId).symbol}²`;
}

export function volumeUnit(lenId: string) {
  return `${findLen(lenId).symbol}³`;
}


export function inputsToSI(inputs: Inputs, lenId: string): Inputs {
  const out: Inputs = {};
  for (const k of Object.keys(inputs)) {
    out[k] = lenToSI(lenId, Number(inputs[k]));
  }
  return out;
}

/* ---------------- Figuras 2D ----------------- */

const PI = Math.PI;

export const SHAPES2D: Shape2D[] = [
  {
    id: "rectangle",
    name: "Retângulo",
    params: [
      { id: "b", label: "Base", dim: "L" },
      { id: "h", label: "Altura", dim: "L" },
    ],
    area: ({ b = 0, h = 0 }) => b * h,
    perimeter: ({ b = 0, h = 0 }) => 2 * (b + h),
  },
  {
    id: "triangle",
    name: "Triângulo",
    params: [
      { id: "b", label: "Base", dim: "L" },
      { id: "h", label: "Altura", dim: "L" },
    ],
    area: ({ b = 0, h = 0 }) => (b * h) / 2,
  },
  {
    id: "circle",
    name: "Círculo",
    params: [{ id: "r", label: "Raio", dim: "L" }],
    area: ({ r = 0 }) => PI * r * r,
    perimeter: ({ r = 0 }) => 2 * PI * r,
  },
  {
    id: "ellipse",
    name: "Elipse",
    params: [
      { id: "a", label: "Semi-eixo maior (a)", dim: "L" },
      { id: "b", label: "Semi-eixo menor (b)", dim: "L" },
    ],
    area: ({ a = 0, b = 0 }) => PI * a * b,
  },
  {
    id: "trapezoid",
    name: "Trapézio",
    params: [
      { id: "B", label: "Base maior (B)", dim: "L" },
      { id: "b", label: "Base menor (b)", dim: "L" },
      { id: "h", label: "Altura", dim: "L" },
    ],
    area: ({ B = 0, b = 0, h = 0 }) => ((B + b) * h) / 2,
  },
  {
    id: "regularPolygon",
    name: "Polígono regular",
    params: [
      { id: "n", label: "Número de lados (n)", dim: "L" }, 
      { id: "s", label: "Lado (s)", dim: "L" },
    ],
    area: ({ n = 0, s = 0 }) => {
      const N = Math.max(3, Math.round(n));
      return (N * s * s) / (4 * Math.tan(PI / N));
    },
  },
  {
    id: "sector",
    name: "Setor circular",
    params: [
      { id: "r", label: "Raio", dim: "L" },
      { id: "theta", label: "Ângulo (rad)", dim: "L" },
    ],
    area: ({ r = 0, theta = 0 }) => 0.5 * r * r * theta,
  },
];

/* ---------------- Sólidos 3D ----------------- */

export const SHAPES3D: Shape3D[] = [
  {
    id: "cube",
    name: "Cubo",
    params: [{ id: "a", label: "Aresta (a)", dim: "L" }],
    volume: ({ a = 0 }) => a ** 3,
    surface: ({ a = 0 }) => 6 * a * a,
  },
  {
    id: "cuboid",
    name: "Paralelepípedo",
    params: [
      { id: "a", label: "Comprimento (a)", dim: "L" },
      { id: "b", label: "Largura (b)", dim: "L" },
      { id: "h", label: "Altura (h)", dim: "L" },
    ],
    volume: ({ a = 0, b = 0, h = 0 }) => a * b * h,
    surface: ({ a = 0, b = 0, h = 0 }) => 2 * (a * b + a * h + b * h),
  },
  {
    id: "sphere",
    name: "Esfera",
    params: [{ id: "r", label: "Raio (r)", dim: "L" }],
    volume: ({ r = 0 }) => (4 / 3) * PI * r ** 3,
    surface: ({ r = 0 }) => 4 * PI * r * r,
  },
  {
    id: "cylinder",
    name: "Cilindro",
    params: [
      { id: "r", label: "Raio (r)", dim: "L" },
      { id: "h", label: "Altura (h)", dim: "L" },
    ],
    volume: ({ r = 0, h = 0 }) => PI * r * r * h,
    surface: ({ r = 0, h = 0 }) => 2 * PI * r * (r + h),
  },
  {
    id: "cone",
    name: "Cone",
    params: [
      { id: "r", label: "Raio (r)", dim: "L" },
      { id: "h", label: "Altura (h)", dim: "L" },
    ],
    volume: ({ r = 0, h = 0 }) => (PI * r * r * h) / 3,
    surface: ({ r = 0, h = 0 }) => {
      const g = Math.sqrt(r * r + h * h);
      return PI * r * (r + g);
    },
  },
  {
    id: "regularPrism",
    name: "Prisma regular",
    params: [
      { id: "n", label: "Número de lados (n)", dim: "L" },
      { id: "s", label: "Lado da base (s)", dim: "L" },
      { id: "h", label: "Altura (h)", dim: "L" },
    ],
    volume: ({ n = 0, s = 0, h = 0 }) => {
      const N = Math.max(3, Math.round(n));
      const areaBase = (N * s * s) / (4 * Math.tan(PI / N));
      return areaBase * h;
    },
    surface: ({ n = 0, s = 0, h = 0 }) => {
      const N = Math.max(3, Math.round(n));
      const areaBase = (N * s * s) / (4 * Math.tan(PI / N));
      const perimetroBase = N * s;
      return 2 * areaBase + perimetroBase * h;
    },
  },
  {
    id: "regularPyramid",
    name: "Pirâmide regular",
    params: [
      { id: "n", label: "Número de lados (n)", dim: "L" },
      { id: "s", label: "Lado da base (s)", dim: "L" },
      { id: "h", label: "Altura (h)", dim: "L" },
    ],
    volume: ({ n = 0, s = 0, h = 0 }) => {
      const N = Math.max(3, Math.round(n));
      const areaBase = (N * s * s) / (4 * Math.tan(PI / N));
      return (areaBase * h) / 3;
    },
  },
];

/* ---------------- Helpers de preparo ---------------- */

export function normalizeInputsToSI(params: Param[], inputs: Inputs, lenId: string): Inputs {
  const out: Inputs = {};
  for (const p of params) {
    const v = Number(inputs[p.id] ?? 0);
    out[p.id] = p.dim === "L" ? lenToSI(lenId, v) : v;
  }
  return out;
}
