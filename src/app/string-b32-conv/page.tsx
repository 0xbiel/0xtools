"use client";
import { useState } from "react";

function removeCommas(value: string) {
  return value.replace(/,/g, "");
}

function formatBytes32String(str: string) {
  // Converts a string to bytes32 hex (0x...)
  if (!str) return "";
  let hex = "0x" + Buffer.from(str, "utf8").toString("hex");
  if (hex.length > 66) hex = hex.slice(0, 66); // 32 bytes = 64 hex chars + 0x
  return hex.padEnd(66, "0");
}

function parseBytes32String(bytes: string) {
  // Converts bytes32 hex (0x...) to string
  if (!bytes || !/^0x[0-9a-fA-F]{64}$/.test(bytes)) return "";
  let hex = bytes.slice(2);
  let str = Buffer.from(hex, "hex").toString("utf8");
  return str.replace(/\u0000+$/, ""); // Remove null padding
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

export default function StringBytes32Conv() {
  const [values, setValues] = useState({
    str: "",
    bytes32: "",
  });
  const [copied, setCopied] = useState({ str: false, bytes32: false });
  const [, setLastChanged] = useState<"str" | "bytes32" | null>(null);

  const handleChange = (field: "str" | "bytes32") => (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = removeCommas(e.target.value);
    let str = values.str, bytes32 = values.bytes32;
    setLastChanged(field);
    if (field === "str") {
      str = input;
      bytes32 = formatBytes32String(str);
    } else if (field === "bytes32") {
      bytes32 = input.startsWith("0x") ? input : "0x" + input;
      if (bytes32.length > 66) bytes32 = bytes32.slice(0, 66);
      str = parseBytes32String(bytes32);
    }
    setValues({ str, bytes32 });
  };

  const handleCopy = (field: "str" | "bytes32") => async () => {
    await navigator.clipboard.writeText(values[field]);
    setCopied((prev) => ({ ...prev, [field]: true }));
    setTimeout(() => setCopied((prev) => ({ ...prev, [field]: false })), 1200);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-2xl mx-auto min-h-screen px-6 py-12">
        <main className="space-y-16">
          <section className="space-y-6">
            <h1 className="text-3xl font-bold text-[var(--main-color)]">
              String-Bytes32 Conversion
            </h1>
            <p className="text-lg text-neutral-700 dark:text-neutral-300">
              Convert between a string and its bytes32 (hex) representation. Enter a value in either field and see the other update in real time.
            </p>
            <div className="flex flex-col gap-5 mt-8">
              <div className="flex flex-col">
                <label htmlFor="str" className="text-sm font-medium">
                  String
                </label>
                <div className="relative flex items-center">
                  <input
                    id="str"
                    type="text"
                    className="w-full px-4 py-3 pr-10 border-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:border-b-2 focus:border-[var(--main-color)] text-lg font-mono rounded-none"
                    value={values.str}
                    onChange={handleChange("str")}
                    placeholder="Enter a string"
                    autoComplete="off"
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none outline-none flex items-center justify-center h-6 w-6"
                    onClick={handleCopy("str")}
                    tabIndex={-1}
                    aria-label="Copy value"
                  >
                    <CopyIcon copied={copied.str} />
                  </button>
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="bytes32" className="text-sm font-medium">
                  Bytes32
                </label>
                <div className="relative flex items-center">
                  <input
                    id="bytes32"
                    type="text"
                    className="w-full px-4 py-3 pr-10 border-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:border-b-2 focus:border-[var(--main-color)] text-lg font-mono rounded-none"
                    value={values.bytes32}
                    onChange={handleChange("bytes32")}
                    placeholder="Enter a bytes32 hex string"
                    autoComplete="off"
                    style={{ paddingRight: "2.5rem" }}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-transparent border-none outline-none flex items-center justify-center h-6 w-6"
                    onClick={handleCopy("bytes32")}
                    tabIndex={-1}
                    aria-label="Copy value"
                  >
                    <CopyIcon copied={copied.bytes32} />
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
