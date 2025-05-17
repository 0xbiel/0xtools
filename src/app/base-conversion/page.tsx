"use client";
import { useState } from "react";

function removeCommas(value: string) {
  return value.replace(/,/g, "");
}

const parseBase = (value: string, base: number) => {
  if (!value) return 0;
  if (!value.includes(".")) return parseInt(value, base);
  const [intPart, fracPart] = value.split(".");
  let intVal = parseInt(intPart || "0", base);
  let fracVal = 0;
  if (fracPart) {
    for (let i = 0; i < fracPart.length; i++) {
      const digit = parseInt(fracPart[i], base);
      if (isNaN(digit)) return NaN;
      fracVal += digit / Math.pow(base, i + 1);
    }
  }
  return intVal + fracVal;
};

const toBase = (value: number, base: number, precision = 12) => {
  if (isNaN(value)) return "";
  const intPart = Math.trunc(value);
  let fracPart = Math.abs(value - intPart);
  let intStr = intPart.toString(base);
  if (fracPart === 0) return intStr;
  let fracStr = "";
  let count = 0;
  while (fracPart > 0 && count < precision) {
    fracPart *= base;
    const digit = Math.trunc(fracPart);
    fracStr += digit.toString(base);
    fracPart -= digit;
    count++;
  }
  return `${intStr}.${fracStr}`;
};

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

export default function BaseConversion() {
  const [values, setValues] = useState({
    bin: "",
    oct: "",
    dec: "",
    hex: "",
  });
  const [copied, setCopied] = useState({ bin: false, oct: false, dec: false, hex: false });
  const [, setLastChanged] = useState<"bin" | "oct" | "dec" | "hex" | null>(null);

  const handleChange = (base: "bin" | "oct" | "dec" | "hex") => (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = removeCommas(e.target.value).toLowerCase();
    let bin = values.bin, oct = values.oct, dec = values.dec, hex = values.hex;
    setLastChanged(base);
    if (base === "bin") {
      if (/[^01.]/.test(input) && input !== "") return;
      bin = input;
      const num = parseBase(bin, 2);
      dec = bin ? toBase(num, 10) : "";
      oct = bin ? toBase(num, 8) : "";
      hex = bin ? toBase(num, 16) : "";
    } else if (base === "oct") {
      if (/[^0-7.]/.test(input) && input !== "") return;
      oct = input;
      const num = parseBase(oct, 8);
      dec = oct ? toBase(num, 10) : "";
      bin = oct ? toBase(num, 2) : "";
      hex = oct ? toBase(num, 16) : "";
    } else if (base === "dec") {
      if (/[^0-9.]/.test(input) && input !== "") return;
      dec = input;
      const num = parseBase(dec, 10);
      bin = dec ? toBase(num, 2) : "";
      oct = dec ? toBase(num, 8) : "";
      hex = dec ? toBase(num, 16) : "";
    } else if (base === "hex") {
      if (/[^0-9a-f.]/.test(input) && input !== "") return;
      hex = input;
      const num = parseBase(hex, 16);
      dec = hex ? toBase(num, 10) : "";
      bin = hex ? toBase(num, 2) : "";
      oct = hex ? toBase(num, 8) : "";
    }
    setValues({ bin, oct, dec, hex });
  };

  const handleCopy = (base: "bin" | "oct" | "dec" | "hex") => async () => {
    await navigator.clipboard.writeText(values[base]);
    setCopied((prev) => ({ ...prev, [base]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [base]: false })), 1200);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-2xl mx-auto min-h-screen px-6 py-12">
        <main className="space-y-16">
          <section className="space-y-6">
            <h1 className="text-3xl font-bold text-[var(--main-color)]">
              Number Base Conversion
            </h1>
            <p className="text-lg text-neutral-700 dark:text-neutral-300">
              Convert between Binary, Octal, Decimal, and Hexadecimal. Enter a value in any field and see the others update in real time.
            </p>
            <div className="flex flex-col gap-5 mt-8">
              <div className="flex flex-col">
                <label htmlFor="bin" className="text-sm font-medium">
                  Binary
                </label>
                <div className="relative flex items-center">
                  <input
                    id="bin"
                    type="text"
                    inputMode="numeric"
                    className="w-full px-4 py-3 pr-10 border-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:border-b-2 focus:border-[var(--main-color)] text-lg font-mono rounded-none"
                    value={values.bin}
                    onChange={handleChange("bin")}
                    placeholder="0"
                    autoComplete="off"
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none outline-none flex items-center justify-center h-6 w-6"
                    onClick={handleCopy("bin")}
                    tabIndex={-1}
                    aria-label="Copy value"
                  >
                    <CopyIcon copied={copied.bin} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="oct" className="text-sm font-medium">
                  Octal
                </label>
                <div className="relative flex items-center">
                  <input
                    id="oct"
                    type="text"
                    inputMode="numeric"
                    className="w-full px-4 py-3 pr-10 border-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:border-b-2 focus:border-[var(--main-color)] text-lg font-mono rounded-none"
                    value={values.oct}
                    onChange={handleChange("oct")}
                    placeholder="0"
                    autoComplete="off"
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none outline-none flex items-center justify-center h-6 w-6"
                    onClick={handleCopy("oct")}
                    tabIndex={-1}
                    aria-label="Copy value"
                  >
                    <CopyIcon copied={copied.oct} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="dec" className="text-sm font-medium">
                  Decimal
                </label>
                <div className="relative flex items-center">
                  <input
                    id="dec"
                    type="text"
                    inputMode="numeric"
                    className="w-full px-4 py-3 pr-10 border-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:border-b-2 focus:border-[var(--main-color)] text-lg font-mono rounded-none"
                    value={values.dec}
                    onChange={handleChange("dec")}
                    placeholder="0"
                    autoComplete="off"
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none outline-none flex items-center justify-center h-6 w-6"
                    onClick={handleCopy("dec")}
                    tabIndex={-1}
                    aria-label="Copy value"
                  >
                    <CopyIcon copied={copied.dec} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="hex" className="text-sm font-medium">
                  Hexadecimal
                </label>
                <div className="relative flex items-center">
                  <input
                    id="hex"
                    type="text"
                    inputMode="text"
                    className="w-full px-4 py-3 pr-10 border-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:border-b-2 focus:border-[var(--main-color)] text-lg font-mono rounded-none"
                    value={values.hex}
                    onChange={handleChange("hex")}
                    placeholder="0"
                    autoComplete="off"
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none outline-none flex items-center justify-center h-6 w-6"
                    onClick={handleCopy("hex")}
                    tabIndex={-1}
                    aria-label="Copy value"
                  >
                    <CopyIcon copied={copied.hex} />
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
