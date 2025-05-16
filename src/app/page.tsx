"use client";
import { useState, useRef } from "react";

function removeCommas(value: string) {
  return value.replace(/,/g, "");
}

function formatNumberNoCommas(value: string) {
  if (!value) return "";
  // Use BigInt for large numbers, fallback to string
  try {
    if (/^\d+$/.test(value) && value.length > 15) {
      // If it's a large integer, show as is
      return value;
    }
    const num = Number(value);
    if (isNaN(num)) return "";
    // Show full precision, no commas, no e-notation
    return num.toLocaleString("en-US", {
      useGrouping: false,
      maximumFractionDigits: 18,
    });
  } catch {
    return value;
  }
}

const WEI_IN_ETH = 1e18;
const GWEI_IN_ETH = 1e9;

function CopyIcon({ copied }: { copied: boolean }) {
  return copied ? (
    // Checkmark icon
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
    // Copy icon
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

export default function Home() {
  const [values, setValues] = useState({
    eth: "",
    gwei: "",
    wei: "",
  });
  const [lastChanged, setLastChanged] = useState<"eth" | "gwei" | "wei" | null>(
    null,
  );
  const [copiedEth, setCopiedEth] = useState(false);
  const [copiedGwei, setCopiedGwei] = useState(false);
  const [copiedWei, setCopiedWei] = useState(false);

  const handleChange =
    (unit: "eth" | "gwei" | "wei") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = removeCommas(e.target.value);
      if (input && isNaN(Number(input))) return;
      let eth = values.eth,
        gwei = values.gwei,
        wei = values.wei;
      setLastChanged(unit);
      if (unit === "eth") {
        eth = input;
        gwei = eth ? (Number(eth) * GWEI_IN_ETH).toString() : "";
        wei = eth ? (Number(eth) * WEI_IN_ETH).toString() : "";
      } else if (unit === "gwei") {
        gwei = input;
        eth = gwei ? (Number(gwei) / GWEI_IN_ETH).toString() : "";
        wei = gwei ? (Number(gwei) * 1e9).toString() : "";
      } else if (unit === "wei") {
        wei = input;
        eth = wei ? (Number(wei) / WEI_IN_ETH).toString() : "";
        gwei = wei ? (Number(wei) / 1e9).toString() : "";
      }
      setValues({ eth, gwei, wei });
    };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-2xl mx-auto min-h-screen px-6 py-12">
        <main className="space-y-16">
          <section className="space-y-6">
            <h1 className="text-3xl font-bold text-[var(--main-color)]">
              ETH Unit Converter
            </h1>
            <p className="text-lg text-neutral-700 dark:text-neutral-300">
              Convert between ETH, GWEI, and WEI instantly. Enter a value in any
              field and see the others update in real time.
            </p>
            <div className="flex flex-col gap-5 mt-8">
              <div className="flex flex-col">
                <label htmlFor="eth" className="text-sm font-medium">
                  ETH
                </label>
                <div className="relative flex items-center">
                  <input
                    id="eth"
                    type="text"
                    inputMode="decimal"
                    className="w-full px-4 py-3 pr-10 border-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:border-b-2 focus:border-[var(--main-color)] text-lg rounded-none"
                    value={formatNumberNoCommas(values.eth)}
                    onChange={handleChange("eth")}
                    placeholder="1.0"
                    autoComplete="off"
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none outline-none flex items-center justify-center h-6 w-6"
                    onClick={async (e) => {
                      e.preventDefault();
                      await navigator.clipboard.writeText(
                        formatNumberNoCommas(values.eth),
                      );
                      setCopiedEth(true);
                      setTimeout(() => setCopiedEth(false), 1200);
                    }}
                    tabIndex={-1}
                    aria-label="Copy value"
                  >
                    <CopyIcon copied={copiedEth} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="gwei" className="text-sm font-medium">
                  GWEI
                </label>
                <div className="relative flex items-center">
                  <input
                    id="gwei"
                    type="text"
                    inputMode="decimal"
                    className="w-full px-4 py-3 pr-10 border-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:border-b-2 focus:border-[var(--main-color)] text-lg rounded-none"
                    value={formatNumberNoCommas(values.gwei)}
                    onChange={handleChange("gwei")}
                    placeholder="1000000000"
                    autoComplete="off"
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none outline-none flex items-center justify-center h-6 w-6"
                    onClick={async (e) => {
                      e.preventDefault();
                      await navigator.clipboard.writeText(
                        formatNumberNoCommas(values.gwei),
                      );
                      setCopiedGwei(true);
                      setTimeout(() => setCopiedGwei(false), 1200);
                    }}
                    tabIndex={-1}
                    aria-label="Copy value"
                  >
                    <CopyIcon copied={copiedGwei} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="wei" className="text-sm font-medium">
                  WEI
                </label>
                <div className="relative flex items-center">
                  <input
                    id="wei"
                    type="text"
                    inputMode="decimal"
                    className="w-full px-4 py-3 pr-10 border-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:border-b-2 focus:border-[var(--main-color)] text-lg rounded-none"
                    value={formatNumberNoCommas(values.wei)}
                    onChange={handleChange("wei")}
                    placeholder="1000000000000000000"
                    autoComplete="off"
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none outline-none flex items-center justify-center h-6 w-6"
                    onClick={async (e) => {
                      e.preventDefault();
                      await navigator.clipboard.writeText(
                        formatNumberNoCommas(values.wei),
                      );
                      setCopiedWei(true);
                      setTimeout(() => setCopiedWei(false), 1200);
                    }}
                    tabIndex={-1}
                    aria-label="Copy value"
                  >
                    <CopyIcon copied={copiedWei} />
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
