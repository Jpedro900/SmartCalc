"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { SwapArrows } from "@/components/SwapArrows";

/* ================== Config ================== */

const API_FIAT = "https://api.exchangerate.host";
const API_CG = "https://api.coingecko.com/api/v3";
const API_FF = "https://api.frankfurter.app";

/** Chips (6 mais populares) */
const CHIPS: string[] = ["USD", "BRL", "EUR", "GBP", "JPY", "ARS"];

const POPULAR_ALL: string[] = [
  "USD","BRL","EUR","GBP","JPY","ARS",
  "CAD","AUD","CHF","CNY",
  "MXN","CLP","COP","PEN","UYU","BOB","PYG","VES",
  "ZAR","TRY","PLN","SEK","NOK","DKK","CZK","HUF","RON",
  "HKD","SGD","NZD","KRW","TWD","THB","IDR","MYR","PHP","VND","INR",
  "AED","SAR","ILS","EGP",
  "BTC","ETH",
];

type CurrencyInfo = { name: string; flag: string; country: string };

const CURRENCY_META: Record<string, CurrencyInfo> = {
  USD: { name: "Dólar norte-americano", flag: "🇺🇸", country: "US" },
  BRL: { name: "Real brasileiro", flag: "🇧🇷", country: "BR" },
  EUR: { name: "Euro", flag: "🇪🇺", country: "EU" },
  GBP: { name: "Libra esterlina", flag: "🇬🇧", country: "GB" },
  JPY: { name: "Iene japonês", flag: "🇯🇵", country: "JP" },

  CAD: { name: "Dólar canadense", flag: "🇨🇦", country: "CA" },
  AUD: { name: "Dólar australiano", flag: "🇦🇺", country: "AU" },
  CHF: { name: "Franco suíço", flag: "🇨🇭", country: "CH" },
  CNY: { name: "Yuan chinês (Renminbi)", flag: "🇨🇳", country: "CN" },

  ARS: { name: "Peso argentino", flag: "🇦🇷", country: "AR" },
  MXN: { name: "Peso mexicano", flag: "🇲🇽", country: "MX" },
  CLP: { name: "Peso chileno", flag: "🇨🇱", country: "CL" },
  COP: { name: "Peso colombiano", flag: "🇨🇴", country: "CO" },
  PEN: { name: "Sol peruano", flag: "🇵🇪", country: "PE" },
  UYU: { name: "Peso uruguaio", flag: "🇺🇾", country: "UY" },
  BOB: { name: "Boliviano", flag: "🇧🇴", country: "BO" },
  PYG: { name: "Guarani paraguaio", flag: "🇵🇾", country: "PY" },
  VES: { name: "Bolívar venezuelano", flag: "🇻🇪", country: "VE" },

  ZAR: { name: "Rand sul-africano", flag: "🇿🇦", country: "ZA" },
  TRY: { name: "Lira turca", flag: "🇹🇷", country: "TR" },
  PLN: { name: "Zlóti polonês", flag: "🇵🇱", country: "PL" },
  SEK: { name: "Coroa sueca", flag: "🇸🇪", country: "SE" },
  NOK: { name: "Coroa norueguesa", flag: "🇳🇴", country: "NO" },
  DKK: { name: "Coroa dinamarquesa", flag: "🇩🇰", country: "DK" },
  HUF: { name: "Florim húngaro", flag: "🇭🇺", country: "HU" },
  CZK: { name: "Coroa tcheca", flag: "🇨🇿", country: "CZ" },
  RON: { name: "Leu romeno", flag: "🇷🇴", country: "RO" },

  HKD: { name: "Dólar de Hong Kong", flag: "🇭🇰", country: "HK" },
  SGD: { name: "Dólar de Singapura", flag: "🇸🇬", country: "SG" },
  NZD: { name: "Dólar neozelandês", flag: "🇳🇿", country: "NZ" },
  KRW: { name: "Won sul-coreano", flag: "🇰🇷", country: "KR" },
  TWD: { name: "Novo dólar taiwanês", flag: "🇹🇼", country: "TW" },
  THB: { name: "Baht tailandês", flag: "🇹🇭", country: "TH" },
  IDR: { name: "Rúpia indonésia", flag: "🇮🇩", country: "ID" },
  MYR: { name: "Ringgit malaio", flag: "🇲🇾", country: "MY" },
  PHP: { name: "Peso filipino", flag: "🇵🇭", country: "PH" },
  VND: { name: "Dong vietnamita", flag: "🇻🇳", country: "VN" },
  INR: { name: "Rupia indiana", flag: "🇮🇳", country: "IN" },
  AED: { name: "Dirham dos EAU", flag: "🇦🇪", country: "AE" },
  SAR: { name: "Rial saudita", flag: "🇸🇦", country: "SA" },
  ILS: { name: "Novo shekel israelense", flag: "🇮🇱", country: "IL" },
  EGP: { name: "Libra egípcia", flag: "🇪🇬", country: "EG" },

  BTC: { name: "Bitcoin", flag: "🟧", country: "BTC" },
  ETH: { name: "Ethereum", flag: "🟪", country: "ETH" },
};

/** Símbolos monetários */
const SYMBOL: Record<string, string> = {
  USD: "$", BRL: "R$", EUR: "€", GBP: "£", JPY: "¥", CNY: "¥",
  AUD: "A$", CAD: "C$", CHF: "Fr.", ARS: "$", MXN: "$", CLP: "$",
  COP: "$", PEN: "S/", UYU: "$U", BOB: "Bs", PYG: "₲", VES: "Bs.",
  ZAR: "R", TRY: "₺", PLN: "zł", SEK: "kr", NOK: "kr", DKK: "kr",
  HUF: "Ft", CZK: "Kč", RON: "lei", HKD: "HK$", SGD: "S$", NZD: "NZ$",
  KRW: "₩", TWD: "NT$", THB: "฿", IDR: "Rp", MYR: "RM", PHP: "₱",
  VND: "₫", INR: "₹", AED: "د.إ", SAR: "﷼", ILS: "₪", EGP: "E£",
  BTC: "₿", ETH: "Ξ",
};

type Mode = "comercial" | "turistico";
type Method = "dinheiro" | "cartao";

/* ================== Helpers ================== */

const isCrypto = (c: string) => c === "BTC" || c === "ETH";
const cgIdFor = (c: string) => (c === "BTC" ? "bitcoin" : c === "ETH" ? "ethereum" : "");

function parseNum(s: string) {
  const n = Number(String(s).replace(/[^\d,.-]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}
function format2(n: number) {
  if (!Number.isFinite(n)) return "";
  return n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function formatRate(n: number) {
  if (!Number.isFinite(n)) return "";
  return n.toLocaleString("pt-BR", { maximumFractionDigits: 8 });
}

function applyTourismRate(
  base: string,
  quote: string,
  rate: number,
  mode: Mode,
  _method: Method,
  spreadPct: number,
  iofPct: number
) {
  if (mode === "comercial") return rate;
  let factor = 1 + spreadPct / 100;
  if (base === "BRL" || quote === "BRL") factor *= 1 + iofPct / 100;
  return rate * factor;
}

async function fetchJSON(url: string, timeoutMs = 8000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { cache: "no-store", signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(id);
  }
}

async function fetchRate(
  base: string,
  quote: string
): Promise<{ rate: number; date: string; provider: string }> {
  base = base.toUpperCase();
  quote = quote.toUpperCase();

  if (base === quote) {
    return { rate: 1, date: new Date().toISOString().slice(0, 10), provider: "static" };
  }

  // ===== FIAT ↔ FIAT =====
  if (!isCrypto(base) && !isCrypto(quote)) {
    try {
      const j = await fetchJSON(`${API_FIAT}/convert?from=${base}&to=${quote}&amount=1`);
      const res = Number(j?.result);
      if (Number.isFinite(res)) return { rate: res, date: j?.date ?? "", provider: "exchangerate.host/convert" };
    } catch {}

    try {
      const j = await fetchJSON(`${API_FIAT}/latest?base=${base}`);
      const res = Number(j?.rates?.[quote]);
      if (Number.isFinite(res)) return { rate: res, date: j?.date ?? "", provider: "exchangerate.host/latest" };
    } catch {}

    try {
      const j = await fetchJSON(`${API_FIAT}/latest?base=USD`);
      const q = Number(j?.rates?.[quote]); // USD->QUOTE
      const b = Number(j?.rates?.[base]);  // USD->BASE
      if (Number.isFinite(q) && Number.isFinite(b) && b !== 0) {
        return { rate: q / b, date: j?.date ?? "", provider: "exchangerate.host/USD-cross" };
      }
    } catch {}

    try {
      const j = await fetchJSON(`${API_FF}/latest?from=${base}&to=${quote}`);
      const res = Number(j?.rates?.[quote]);
      if (Number.isFinite(res)) return { rate: res, date: j?.date ?? "", provider: "frankfurter.direct" };
    } catch {}

    try {
      const j = await fetchJSON(`${API_FF}/latest?from=USD`);
      const q = Number(j?.rates?.[quote]);
      const b = Number(j?.rates?.[base]);
      if (Number.isFinite(q) && Number.isFinite(b) && b !== 0) {
        return { rate: q / b, date: j?.date ?? "", provider: "frankfurter.USD-cross" };
      }
    } catch {}

    return { rate: NaN, date: "", provider: "none" };
  }

  // ===== PARES COM CRIPTO (CoinGecko) =====
  if (isCrypto(base) && !isCrypto(quote)) {
    const id = cgIdFor(base);
    const vs = quote.toLowerCase();
    const j = await fetchJSON(`${API_CG}/simple/price?ids=${id}&vs_currencies=${vs}`);
    const val = Number(j?.[id]?.[vs]);
    return { rate: val, date: new Date().toISOString().slice(0, 10), provider: `coingecko:${id}->${vs}` };
  }

  if (!isCrypto(base) && isCrypto(quote)) {
    const id = cgIdFor(quote);
    const vs = base.toLowerCase();
    const j = await fetchJSON(`${API_CG}/simple/price?ids=${id}&vs_currencies=${vs}`);
    const price = Number(j?.[id]?.[vs]);
    return {
      rate: price ? 1 / price : NaN,
      date: new Date().toISOString().slice(0, 10),
      provider: `coingecko:${id}/${vs}-inverse`,
    };
  }

  const idA = cgIdFor(base);
  const idB = cgIdFor(quote);
  const j = await fetchJSON(`${API_CG}/simple/price?ids=${idA},${idB}&vs_currencies=usd`);
  const aUsd = Number(j?.[idA]?.usd);
  const bUsd = Number(j?.[idB]?.usd);
  const cross = aUsd && bUsd ? aUsd / bUsd : NaN;
  return {
    rate: cross,
    date: new Date().toISOString().slice(0, 10),
    provider: `coingecko:${idA}/${idB}-via-USD`,
  };
}

/* ================== UI ================== */

export default function MoedasClient() {
  const [base, setBase] = useState("USD");
  const [quote, setQuote] = useState("BRL");

  const [amountBase, setAmountBase] = useState("1");
  const [amountQuote, setAmountQuote] = useState("");

  const [symbols, setSymbols] = useState<string[]>([]);
  const [rate, setRate] = useState<number>(NaN);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [provider, setProvider] = useState<string>("");

  const [mode, setMode] = useState<Mode>("comercial");
  const [method, setMethod] = useState<Method>("dinheiro");
  const [spreadPct, setSpreadPct] = useState<number>(3.0);
  const [iofPct, setIofPct] = useState<number>(1.1);

  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setIofPct(method === "dinheiro" ? 1.1 : 5.38);
    setSpreadPct(method === "dinheiro" ? 3.0 : 4.0);
  }, [method]);

  useEffect(() => {
    (async () => {
      try {
        const json = await fetchJSON(`${API_FIAT}/symbols`);
        const list = Object.keys(json.symbols ?? {});
        const full = Array.from(new Set([...POPULAR_ALL, ...list])).sort();
        setSymbols(full);
      } catch {
        setSymbols(Object.keys(CURRENCY_META));
      }
    })();
  }, []);

  const effectiveRate = useMemo(() => {
    if (!Number.isFinite(rate)) return NaN;
    return applyTourismRate(base, quote, rate, mode, method, spreadPct, iofPct);
  }, [rate, base, quote, mode, method, spreadPct, iofPct]);

  useEffect(() => {
    const v = parseNum(amountBase);
    if (!Number.isFinite(v) || !Number.isFinite(effectiveRate)) {
      setAmountQuote("");
      return;
    }
    setAmountQuote(format2(v * effectiveRate));
  }, [amountBase, effectiveRate]);

  async function convertNow() {
    setConverting(true);
    setError("");
    try {
      const { rate, date, provider } = await fetchRate(base, quote);
      if (!Number.isFinite(rate)) throw new Error("Não foi possível obter a taxa para este par.");
      setRate(rate);
      setLastUpdated(date);
      setProvider(provider);

      const v = parseNum(amountBase);
      if (Number.isFinite(v)) {
        const eff = applyTourismRate(base, quote, rate, mode, method, spreadPct, iofPct);
        setAmountQuote(format2(v * eff));
      } else {
        setAmountQuote("");
      }
    } catch (err: unknown) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Não foi possível obter a taxa agora. Tente novamente."
      );
    } finally {
      setConverting(false);
    }
  }

  function onEditQuote(s: string) {
    setAmountQuote(s);
    const v = parseNum(s);
    if (!Number.isFinite(v) || !Number.isFinite(effectiveRate) || effectiveRate === 0) {
      setAmountBase("");
      return;
    }
    setAmountBase(format2(v / effectiveRate));
  }

  function swap() {
    setBase(quote);
    setQuote(base);
  }

  function chipSet(side: "base" | "quote", code: string) {
    if (side === "base") setBase(code);
    else setQuote(code);
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold">Conversor de Moedas</h1>
      <p className="mt-2 text-sm text-slate-600">
        Clique em <b>Converter agora</b> para buscar a cotação mais recente. Use <b>Comercial</b> para
        taxa de mercado e <b>Turístico</b> para simular IOF e spread.
      </p>

      {/* Controles de modo */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg bg-slate-100 p-1">
          <button
            className={`cursor-pointer px-3 py-2 text-sm font-medium rounded-md ${
              mode === "comercial" ? "bg-white border border-slate-300" : "text-slate-600"
            }`}
            onClick={() => setMode("comercial")}
          >
            Comercial
          </button>
          <button
            className={`cursor-pointer px-3 py-2 text-sm font-medium rounded-md ${
              mode === "turistico" ? "bg-white border border-slate-300" : "text-slate-600"
            }`}
            onClick={() => setMode("turistico")}
          >
            Turístico
          </button>
        </div>

        {mode === "turistico" && (
          <>
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <span>Método</span>
              <select
                value={method}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setMethod(e.target.value as Method)
                }
                className="rounded-md border border-slate-200 bg-white px-2 py-1"
              >
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao">Cartão</option>
              </select>
            </div>

            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <span>Spread</span>
              <input
                value={spreadPct}
                onChange={(e) => setSpreadPct(parseNum(e.target.value) || 0)}
                className="w-20 rounded-md border border-slate-200 bg-white px-2 py-1 text-right"
                inputMode="decimal"
              />
              <span>%</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
              <span>IOF</span>
              <input
                value={iofPct}
                onChange={(e) => setIofPct(parseNum(e.target.value) || 0)}
                className="w-20 rounded-md border border-slate-200 bg-white px-2 py-1 text-right"
                inputMode="decimal"
              />
              <span>%</span>
            </div>
          </>
        )}

        {/* Botão de converter */}
        <button
          onClick={convertNow}
          disabled={converting}
          className="ml-auto cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          type="button"
        >
          {converting ? "Convertendo..." : "Converter agora"}
        </button>
      </div>

      {/* Caixas principais */}
      <section className="mt-4 grid gap-4 md:grid-cols-[1fr_auto_1fr]">
        <CurrencyBox
          titleLeft
          code={base}
          onCodeChange={setBase}
          amount={amountBase}
          onAmountChange={setAmountBase}
          symbols={symbols}
          chips={CHIPS}
          onChip={(c) => chipSet("base", c)}
        />

        <div className="flex items-center justify-center">
          <SwapArrows onClick={swap} />
        </div>

        <CurrencyBox
          code={quote}
          onCodeChange={setQuote}
          amount={amountQuote}
          onAmountChange={onEditQuote}
          symbols={symbols}
          chips={CHIPS}
          onChip={(c) => chipSet("quote", c)}
        />
      </section>

      {/* Rodapé de taxa/erro */}
      <div className="mt-4 text-sm text-slate-600">
        {error ? (
          <span className="text-rose-600">{error}</span>
        ) : Number.isFinite(effectiveRate) ? (
          <>
            Taxa {mode === "comercial" ? "comercial" : "turística"} ({base}→{quote}):{" "}
            <b>{formatRate(effectiveRate)}</b>
            {mode === "turistico" && (
              <>
                {" "}
                — spread {spreadPct}%{base === "BRL" || quote === "BRL" ? ` + IOF ${iofPct}%` : ""}
              </>
            )}
            {lastUpdated && <> • Atualizado: {lastUpdated}</>}
            {provider && <span className="ml-2 text-xs text-slate-400">[{provider}]</span>}
          </>
        ) : (
          "Clique em “Converter agora” para obter a taxa."
        )}
      </div>
    </main>
  );
}

/* =============== Subcomponentes =============== */

function Flag({ code }: { code: string }) {
  const meta = CURRENCY_META[code] ?? { flag: "🏳️", country: code, name: code };
  const isBtc = code === "BTC";
  const isEth = code === "ETH";

  if (isBtc) {
    return (
      <span className="relative inline-block h-5 w-5">
        <Image src="/bitcoin-logo.png" alt="Bitcoin" fill className="object-contain" />
      </span>
    );
  }
  if (isEth) {
    return (
      <span className="relative inline-block h-5 w-5">
        <Image src="/Ethereum-Logo.png" alt="Ethereum" fill className="object-contain" />
      </span>
    );
  }

  // usa SVG do /public/flags; se não existir, mostra emoji
  const src = `/flags/${meta.country.toLowerCase()}.svg`;
  const [broken, setBroken] = useState(false);
  return broken ? (
    <span aria-hidden className="text-lg leading-none">{meta.flag}</span>
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={meta.country}
      className="h-5 w-5 rounded-sm object-cover"
      onError={() => setBroken(true)}
    />
  );
}

/** Dropdown simples com bandeiras */
function FlagSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const meta = CURRENCY_META[value] ?? { name: value, flag: "🏳️", country: value };

  return (
    <div ref={ref} className="relative w-full">
      {/* Botão (mostra bandeira e rótulo) */}
      <button
        type="button"
        className="cursor-pointer flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex items-center gap-2">
          <Flag code={value} />
          <span className="font-medium">
            {meta.country} <span className="text-slate-400">({value} {meta.name})</span>
          </span>
        </span>
        <svg width="16" height="16" viewBox="0 0 20 20" className="text-slate-500">
          <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      {/* Lista */}
      {open && (
        <div className="absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
          {options.map((c) => {
            const m = CURRENCY_META[c] ?? { name: c, flag: "🏳️", country: c };
            return (
              <button
                key={c}
                type="button"
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                }}
                className={`cursor-pointer flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-100 ${
                  c === value ? "bg-slate-50" : ""
                }`}
              >
                <Flag code={c} />
                <span className="font-medium">
                  {m.country} <span className="text-slate-400">({c} {m.name})</span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CurrencyBox(props: {
  titleLeft?: boolean;
  code: string;
  onCodeChange: (c: string) => void;
  amount: string;
  onAmountChange: (s: string) => void;
  symbols: string[];
  chips: string[];
  onChip: (c: string) => void;
}) {
  const { code, onCodeChange, amount, onAmountChange, symbols, chips, onChip, titleLeft } = props;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      {/* Cabeçalho: seletor customizado com bandeira */}
      <div className="flex items-center gap-2">
        <FlagSelect value={code} onChange={onCodeChange} options={symbols} />
      </div>

      {/* Input com símbolo à esquerda */}
      <div className="mt-3 flex items-center gap-2">
        <span className="min-w-[3ch] text-lg text-slate-500">{SYMBOL[code] ?? code}</span>
        <input
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          inputMode="decimal"
          className="w-full rounded-lg bg-slate-100 px-4 py-4 text-2xl outline-none"
          placeholder={titleLeft ? "1,00" : ""}
        />
      </div>

      {/* Chips (6) */}
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        {chips.map((c) => {
          const m = CURRENCY_META[c] ?? { name: c, flag: "🏳️", country: c };
          return (
            <button
              key={c}
              className={`cursor-pointer rounded-full px-2 py-1 ${
                c === code ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
              }`}
              onClick={() => onChip(c)}
              type="button"
              title={`${m.country} (${c} ${m.name})`}
            >
              <span className="mr-1 align-middle inline-flex"><Flag code={c} /></span>
              {c}
            </button>
          );
        })}
      </div>
    </div>
  );
}
