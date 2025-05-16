"use client";
import { useState } from "react";

function removeCommas(value: string) {
  return value.replace(/,/g, "");
}

function formatNumberNoCommas(value: string) {
  if (!value) return "";
  try {
    if (/^\d+$/.test(value) && value.length > 15) {
      return value;
    }
    const num = Number(value);
    if (isNaN(num)) return "";
    return num.toLocaleString("en-US", {
      useGrouping: false,
      maximumFractionDigits: 18,
    });
  } catch {
    return value;
  }
}

function CopyIcon({ copied }: { copied: boolean }) {
  return copied ? (
    <svg
      className="w-4 h-4 text-green-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg
      className="w-4 h-4 text-neutral-500 hover:text-[var(--main-color)] transition"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

export default function TokenCalc() {
  const [values, setValues] = useState({
    decimals: "18",
    units: "",
    base: "",
  });
  const [, setLastChanged] = useState<
    "decimals" | "units" | "base" | null
  >(null);
  const [copiedUnits, setCopiedUnits] = useState(false);
  const [copiedBase, setCopiedBase] = useState(false);

  const handleChange =
    (unit: "decimals" | "units" | "base") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let input = removeCommas(e.target.value);
      if (unit !== "decimals" && input && isNaN(Number(input))) return;
      let decimals = values.decimals,
        units = values.units,
        base = values.base;
      setLastChanged(unit);
      const d = Number(decimals);
      if (unit === "decimals") {
        decimals = input.replace(/[^0-9]/g, "");
        if (!decimals) decimals = "0";
        if (units) {
          try {
            // Use string math for units to base
            const [intPart, fracPart = ""] = units.split(".");
            let baseStr =
              BigInt(intPart || "0") *
              BigInt("1" + "0".repeat(Number(decimals)));
            let frac = fracPart
              .padEnd(Number(decimals), "0")
              .slice(0, Number(decimals));
            if (frac && Number(frac) > 0) {
              baseStr += BigInt(frac);
            }
            base = baseStr.toString();
          } catch {
            base = "";
          }
        } else {
          base = "";
        }
      } else if (unit === "units") {
        units = input;
        try {
          if (units) {
            const [intPart, fracPart = ""] = units.split(".");
            let baseStr = BigInt(intPart || "0") * BigInt("1" + "0".repeat(d));
            let frac = fracPart.padEnd(d, "0").slice(0, d);
            if (frac && Number(frac) > 0) {
              baseStr += BigInt(frac);
            }
            base = baseStr.toString();
          } else {
            base = "";
          }
        } catch {
          base = "";
        }
      } else if (unit === "base") {
        base = input;
        try {
          if (base) {
            let baseBig = BigInt(base);
            let divisor = BigInt("1" + "0".repeat(d));
            let intPart = baseBig / divisor;
            let fracPart = (baseBig % divisor).toString().padStart(d, "0");
            // Remove trailing zeros in fractional part
            fracPart = fracPart.replace(/0+$/, "");
            units =
              fracPart.length > 0
                ? `${intPart.toString()}.${fracPart}`
                : intPart.toString();
          } else {
            units = "";
          }
        } catch {
          units = "";
        }
      }
      setValues({ decimals, units, base });
    };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-2xl mx-auto min-h-screen px-6 py-12">
        <main className="space-y-16">
          <section className="space-y-6">
            <h1 className="text-3xl font-bold text-[var(--main-color)]">
              Token Unit Converter
            </h1>
            <p className="text-lg text-neutral-700 dark:text-neutral-300">
              Convert between token units and base values for any ERC-20 token.
              Set decimals, enter a value in either field, and see the other
              update in real time.
            </p>
            <div className="flex flex-col gap-5 mt-8">
              <div className="flex flex-col">
                <label htmlFor="decimals" className="text-sm font-medium">
                  Decimals
                </label>
                <input
                  id="decimals"
                  type="number"
                  min="0"
                  max="36"
                  className="w-full px-4 py-3 border-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:border-b-2 focus:border-[var(--main-color)] text-lg rounded-none"
                  value={values.decimals}
                  onChange={handleChange("decimals")}
                  placeholder="18"
                  autoComplete="off"
                  style={{ maxWidth: "8rem" }}
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="units" className="text-sm font-medium">
                  Units (human readable)
                </label>
                <div className="relative flex items-center">
                  <input
                    id="units"
                    type="text"
                    inputMode="decimal"
                    className="w-full px-4 py-3 pr-10 border-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:border-b-2 focus:border-[var(--main-color)] text-lg rounded-none"
                    value={formatNumberNoCommas(values.units)}
                    onChange={handleChange("units")}
                    placeholder="0"
                    autoComplete="off"
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none outline-none flex items-center justify-center h-6 w-6"
                    onClick={async (e) => {
                      e.preventDefault();
                      await navigator.clipboard.writeText(
                        formatNumberNoCommas(values.units),
                      );
                      setCopiedUnits(true);
                      setTimeout(() => setCopiedUnits(false), 1200);
                    }}
                    tabIndex={-1}
                    aria-label="Copy value"
                  >
                    <CopyIcon copied={copiedUnits} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="base" className="text-sm font-medium">
                  Base (raw integer)
                </label>
                <div className="relative flex items-center">
                  <input
                    id="base"
                    type="text"
                    inputMode="decimal"
                    className="w-full px-4 py-3 pr-10 border-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:border-b-2 focus:border-[var(--main-color)] text-lg rounded-none"
                    value={formatNumberNoCommas(values.base)}
                    onChange={handleChange("base")}
                    placeholder="0"
                    autoComplete="off"
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none outline-none flex items-center justify-center h-6 w-6"
                    onClick={async (e) => {
                      e.preventDefault();
                      await navigator.clipboard.writeText(
                        formatNumberNoCommas(values.base),
                      );
                      setCopiedBase(true);
                      setTimeout(() => setCopiedBase(false), 1200);
                    }}
                    tabIndex={-1}
                    aria-label="Copy value"
                  >
                    <CopyIcon copied={copiedBase} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
