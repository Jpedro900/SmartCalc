type Props = {
  onClick: () => void;
  size?: number;
};

export function SwapArrows({ onClick, size = 44 }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Inverter moedas"
      className="flex items-center justify-center rounded-full shadow-sm ring-1 ring-slate-200 bg-white hover:bg-slate-50 transition-colors"
      style={{ width: size, height: size }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width={size * 0.8}
        height={size * 0.8}
      >
        {/* círculo externo */}
        <circle
          cx="32"
          cy="32"
          r="30"
          fill="none"
          stroke="#e2e8f0" /* slate-200 */
          strokeWidth="2"
        />

        {/* seta para a esquerda (topo) */}
        <path
          d="M44 22H20M20 22l6-6M20 22l6 6"
          fill="none"
          stroke="#4338ca" /* indigo-700 */
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* seta para a direita (base) */}
        <path
          d="M20 42h24M44 42l-6-6M44 42l-6 6"
          fill="none"
          stroke="#0ea5e9" /* sky-500 */
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
