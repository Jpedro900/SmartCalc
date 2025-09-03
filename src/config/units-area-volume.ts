// src/config/units-area-volume.ts

export type Unit = { id: string; label: string; toSI: number }; 

export const LENGTH_UNITS: Unit[] = [
  { id: "mm", label: "mm", toSI: 1e-3 },
  { id: "cm", label: "cm", toSI: 1e-2 },
  { id: "m",  label: "m",  toSI: 1 },
  { id: "km", label: "km", toSI: 1e3 },
  { id: "in", label: "in", toSI: 0.0254 },
  { id: "ft", label: "ft", toSI: 0.3048 },
  { id: "yd", label: "yd", toSI: 0.9144 },
];

export const AREA_UNITS: Unit[] = [
  { id: "mm²", label: "mm²", toSI: 1e-6 },
  { id: "cm²", label: "cm²", toSI: 1e-4 },
  { id: "m²",  label: "m²",  toSI: 1 },
  { id: "km²", label: "km²", toSI: 1e6 },
  { id: "in²", label: "in²", toSI: 0.00064516 },
  { id: "ft²", label: "ft²", toSI: 0.09290304 },
  { id: "yd²", label: "yd²", toSI: 0.83612736 },
  { id: "ha",  label: "hectare", toSI: 10_000 },
  { id: "acre", label: "acre", toSI: 4046.8564224 },
];

export const VOLUME_UNITS: Unit[] = [
  { id: "mm³", label: "mm³", toSI: 1e-9 },
  { id: "cm³", label: "cm³", toSI: 1e-6 },
  { id: "mL",  label: "mL",  toSI: 1e-6 },
  { id: "L",   label: "L",   toSI: 1e-3 },
  { id: "m³",  label: "m³",  toSI: 1 },
  { id: "in³", label: "in³", toSI: 0.000016387064 },
  { id: "ft³", label: "ft³", toSI: 0.028316846592 },
  { id: "yd³", label: "yd³", toSI: 0.764554857984 },
];

export const byId = <T extends Unit>(list: T[], id: string) =>
  list.find(u => u.id === id)!;
