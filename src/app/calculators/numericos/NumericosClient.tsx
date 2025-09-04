"use client";

import { useEffect, useMemo, useState } from "react";
import { Hash, Info, RefreshCw } from "lucide-react";

type Base = "dec" | "bin" | "hex" | "oct";
type Field = {
  base: Base;
  label: string;
  placeholder: string;
  pattern: RegExp;
};

const FIELDS: Field[] = [
  {
    base: "dec",
    label: "Decimal",
    placeholder: "Ex.: 255",
    pattern: /^[+-]?\d+$/,
  },
  {
    base: "bin",
    label: "Binário",
    placeholder: "Ex.: 11111111",
    pattern: /^[+-]?[01]+$/,
  },
  {
    base: "hex",
    label: "Hexadecimal",
    placeholder: "Ex.: FF",
    pattern: /^[+-]?[0-9a-fA-F]+$/,
  },
  {
    base: "oct",
    label: "Octal",
    placeholder: "Ex.: 377",
    pattern: /^[+-]?[0-7]+$/,
  },
];

/** Converte texto (na base indicada) para BigInt com validação. */
function parseToBigInt(text: string, base: Base): bigint | null {
  const s = text.trim();
  if (!s) return null;

  // Validação sintática (evita aceitar caracteres fora da base)
  const field = FIELDS.find((f) => f.base === base)!;
  if (!field.pattern.test(s)) return null;

  const negative = s.startsWith("-");
  const body = s.replace(/^[+-]/, ""); // remove +/-

  // Monta string com prefixo para BigInt()
  let prefixed = body;
  if (base === "bin") prefixed = "0b" + body;
  else if (base === "oct") prefixed = "0o" + body;
  else if (base === "hex") prefixed = "0x" + body;
  // dec: sem prefixo

  try {
    const bi = BigInt(prefixed);
    return negative ? -bi : bi;
  } catch {
    return null;
  }
}

function shallowEqualObj<A extends Record<string, unknown>>(a: A, b: A) {
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  for (const k of ka) if (a[k] !== b[k]) return false;
  return true;
}

function toBaseString(n: bigint, base: Base): string {
  const sign = n < 0n ? "-" : "";
  const abs = n < 0n ? -n : n;
  if (base === "dec") return sign + abs.toString(10);
  if (base === "bin") return sign + abs.toString(2);
  if (base === "oct") return sign + abs.toString(8);
  if (base === "hex") return sign + abs.toString(16).toUpperCase();
  return sign + abs.toString(10);
}

export default function NumericosClient() {
  const [focusBase, setFocusBase] = useState<Base>("dec");
  const [values, setValues] = useState<Record<Base, string>>({
    dec: "",
    bin: "",
    hex: "",
    oct: "",
  });

  function handleChange(base: Base, v: string) {
    setFocusBase(base);
    setValues((old) => ({ ...old, [base]: v }));
  }

  const synced = useMemo(() => {
    const v = values[focusBase];
    const field = FIELDS.find((f) => f.base === focusBase)!;

    if (!v) {
      // vazio: mantém o que o usuário digitou e não força sync
      return { ok: false as const, values: { ...values } };
    }

    if (!field.pattern.test(v.trim())) {
      // inválido: limpa os demais para comunicar erro visualmente
      const cleared = { ...values };
      FIELDS.filter((f) => f.base !== focusBase).forEach((f) => (cleared[f.base] = ""));
      return { ok: false as const, values: cleared };
    }

    const bi = parseToBigInt(v, focusBase);
    if (bi === null) {
      return { ok: false as const, values: { ...values } };
    }

    const out: Record<Base, string> = {
      dec: toBaseString(bi, "dec"),
      bin: toBaseString(bi, "bin"),
      hex: toBaseString(bi, "hex"),
      oct: toBaseString(bi, "oct"),
    };
    return { ok: true as const, values: out };
  }, [values, focusBase]);

  // Sincroniza outros campos quando o atual está válido
  useEffect(() => {
    if (synced.ok) {
      setValues((prev) => (shallowEqualObj(prev, synced.values) ? prev : synced.values));
    }
  }, [synced]); // intencional: evita loop; usamos o 'ok' como gatilho

  function clearAll() {
    setValues({ dec: "", bin: "", hex: "", oct: "" });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* header */}
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
          <Hash className="h-5 w-5 text-indigo-600" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Sistemas numéricos</h1>
          <p className="text-slate-500">
            Converta entre Decimal, Binário, Hexadecimal e Octal. Suporta números negativos.
          </p>
        </div>
      </div>

      {/* inputs */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          {FIELDS.map((f) => (
            <label key={f.base} className="block">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-slate-700">{f.label}</div>
                {focusBase === f.base && (
                  <span className="inline-flex items-center gap-1 text-xs text-indigo-600">
                    <RefreshCw className="h-3.5 w-3.5" /> origem
                  </span>
                )}
              </div>
              <input
                inputMode={f.base === "dec" ? "numeric" : "text"}
                className={`mt-1 w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none ring-indigo-200 focus:ring ${
                  f.base === "hex" ? "uppercase" : ""
                }`}
                placeholder={f.placeholder}
                value={values[f.base]}
                onChange={(e) => handleChange(f.base, e.target.value)}
                onFocus={() => setFocusBase(f.base)}
                aria-label={f.label}
              />
            </label>
          ))}
        </div>

        <div className="mt-3 flex items-start gap-2 text-sm text-slate-600">
          <Info className="mt-0.5 h-4 w-4 text-slate-400" />
          <p>
            Regras: <strong>binário</strong> (0–1), <strong>octal</strong> (0–7),{" "}
            <strong>decimal</strong> (0–9), <strong>hexadecimal</strong> (0–9 A–F). Aceita sinal{" "}
            <code>+</code>/<code>-</code>.
          </p>
        </div>

        <div className="mt-3">
          <button
            type="button"
            className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm hover:bg-slate-50"
            onClick={clearAll}
          >
            Limpar
          </button>
        </div>
      </section>
    </div>
  );
}
