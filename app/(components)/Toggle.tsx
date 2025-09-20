"use client";

type Props = {
  checked: boolean;
  onChange: (b: boolean) => void;
  labels: [string, string]; // [off, on]
  ariaLabel?: string;
};

export default function Toggle({ checked, onChange, labels, ariaLabel }: Props) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 px-2 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition focus-ring`}
    >
      <span className={`text-xs ${!checked ? "text-white" : "text-slate-400"}`}>{labels[0]}</span>
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
          checked ? "bg-accent-500" : "bg-slatey-600"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
      <span className={`text-xs ${checked ? "text-white" : "text-slate-400"}`}>{labels[1]}</span>
    </button>
  );
}
