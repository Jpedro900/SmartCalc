export type Param = {
  id: string;
  label: string;
  dim: "L" | "N";
};

export type Shape2D = {
  id: string;
  name: string;
  params: Param[];
  area: (p: Record<string, number>) => number; // m²
  formula?: string;
  annotate?: (p: Record<string, number>) => "b-h" | "r" | "ab" | undefined;
};

export type Shape3D = {
  id: string;
  name: string;
  params: Param[];
  volume: (p: Record<string, number>) => number; // m³
  formula?: string;
 annotate?: (p: Record<string, number>) => "a" | "r" | "r-h" | "abc" | undefined;
};

const PI = Math.PI;

export const SHAPES2D: Shape2D[] = [
  {
    id: "retangulo",
    name: "Retângulo",
    params: [
      { id: "b", label: "Base", dim: "L" },
      { id: "h", label: "Altura", dim: "L" },
    ],
    area: (p) => (p.b ?? 0) * (p.h ?? 0),
    formula: "A = b · h",
    annotate: () => "b-h",
  },
  {
    id: "triangulo",
    name: "Triângulo",
    params: [
      { id: "b", label: "Base", dim: "L" },
      { id: "h", label: "Altura", dim: "L" },
    ],
    area: (p) => 0.5 * (p.b ?? 0) * (p.h ?? 0),
    formula: "A = (b · h) / 2",
    annotate: () => "b-h",
  },
  {
    id: "circulo",
    name: "Círculo",
    params: [{ id: "r", label: "Raio", dim: "L" }],
    area: (p) => PI * Math.pow(p.r ?? 0, 2),
    formula: "A = π · r²",
    annotate: () => "r",
  },
  {
    id: "trapezio",
    name: "Trapézio",
    params: [
      { id: "B", label: "Base maior", dim: "L" },
      { id: "b", label: "Base menor", dim: "L" },
      { id: "h", label: "Altura", dim: "L" },
    ],
    area: (p) => ((p.B ?? 0) + (p.b ?? 0)) * (p.h ?? 0) / 2,
    formula: "A = (B + b) · h / 2",
    annotate: () => "ab",
  },
  {
    id: "elipse",
    name: "Elipse",
    params: [
      { id: "a", label: "Semieixo maior (a)", dim: "L" },
      { id: "b", label: "Semieixo menor (b)", dim: "L" },
    ],
    area: (p) => PI * (p.a ?? 0) * (p.b ?? 0),
    formula: "A = π · a · b",
    annotate: () => "ab",
  },
];

export const SHAPES3D: Shape3D[] = [
  {
    id: "cubo",
    name: "Cubo",
    params: [{ id: "a", label: "Aresta (a)", dim: "L" }],
    volume: (p) => Math.pow(p.a ?? 0, 3),
    formula: "V = a³",
    annotate: () => "a",
  },
  {
    id: "cilindro",
    name: "Cilindro",
    params: [
      { id: "r", label: "Raio (r)", dim: "L" },
      { id: "h", label: "Altura (h)", dim: "L" },
    ],
    volume: (p) => PI * Math.pow(p.r ?? 0, 2) * (p.h ?? 0),
    formula: "V = π · r² · h",
    annotate: () => "r-h",
  },
  {
    id: "esfera",
    name: "Esfera",
    params: [{ id: "r", label: "Raio (r)", dim: "L" }],
    volume: (p) => (4 / 3) * PI * Math.pow(p.r ?? 0, 3),
    formula: "V = 4/3 · π · r³",
    annotate: () => "r",
  },
  {
    id: "cone",
    name: "Cone",
    params: [
      { id: "r", label: "Raio (r)", dim: "L" },
      { id: "h", label: "Altura (h)", dim: "L" },
    ],
    volume: (p) => (PI * Math.pow(p.r ?? 0, 2) * (p.h ?? 0)) / 3,
    formula: "V = π · r² · h / 3",
    annotate: () => "r-h",
  },
  {
    id: "paralelepipedo",
    name: "Paralelepípedo",
    params: [
      { id: "a", label: "Aresta a", dim: "L" },
      { id: "b", label: "Aresta b", dim: "L" },
      { id: "c", label: "Aresta c", dim: "L" },
    ],
    volume: (p) => (p.a ?? 0) * (p.b ?? 0) * (p.c ?? 0),
    formula: "V = a · b · c",
    annotate: () => "abc",
  },
];
