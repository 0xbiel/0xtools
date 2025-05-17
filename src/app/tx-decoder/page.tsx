"use client";
import { useState } from "react";
import { parseTransaction } from "viem";

// Use viem for robust, browser-compatible transaction decoding
let decodeTx: (raw: string) => any = (raw: string) => {
  try {
    const hex = raw.replace(/^0x/, "");
    if (!/^([0-9a-fA-F]{2})+$/.test(hex)) {
      return { error: "Input is not valid hex." };
    }
    // Check for valid Ethereum tx type prefix
    const firstByte = hex.slice(0, 2).toLowerCase();
    if (!(firstByte === "02" || firstByte === "01" || firstByte === "00" || firstByte === "f8" || firstByte === "ec")) {
      return { error: `Input does not look like a valid Ethereum transaction.\n\nMake sure you are pasting a raw signed transaction, not calldata or a message.\n\nFirst byte: 0x${firstByte}` };
    }
    const tx = parseTransaction(`0x${hex}`);
    return tx;
  } catch (e) {
    if ((e as any).message && (e as any).message.includes('Serialized transaction type')) {
      return { error: `This does not appear to be a valid Ethereum transaction.\n\n${(e as any).message}\n\nMake sure you are pasting a raw signed transaction, not calldata or a message.` };
    }
    return { error: (e as any).message || String(e) };
  }
};

// Safely stringify objects with BigInt values
function bigIntReplacer(_key: string, value: any) {
  return typeof value === "bigint" ? value.toString() : value;
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

export default function TxDecoder() {
  const [raw, setRaw] = useState("");
  const [decoded, setDecoded] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleDecode = () => {
    setError("");
    setDecoded(null);
    if (!raw) return;
    const result = decodeTx(raw);
    if (result && result.error) setError(result.error);
    else setDecoded(result);
  };

  const handleCopy = async () => {
    if (!decoded) return;
    await navigator.clipboard.writeText(JSON.stringify(decoded, bigIntReplacer, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-2xl mx-auto min-h-screen px-6 py-12">
        <main className="space-y-16">
          <section className="space-y-6">
            <h1 className="text-3xl font-bold text-[var(--main-color)]">
              Tx Decoder
            </h1>
            <p className="text-lg text-neutral-700 dark:text-neutral-300">
              Decode a raw Ethereum transaction. Paste the raw transaction hex below and decode.
            </p>
            <div className="flex flex-col gap-5 mt-8">
              <div className="flex flex-col">
                <label htmlFor="raw" className="text-sm font-medium">
                  Raw Transaction
                </label>
                <textarea
                  id="raw"
                  className="w-full px-4 py-3 border-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:border-b-2 focus:border-[var(--main-color)] text-lg font-mono rounded-none min-h-[48px]"
                  value={raw}
                  onChange={e => setRaw(e.target.value)}
                  placeholder="0x..."
                  autoComplete="off"
                  style={{ minHeight: 48 }}
                />
              </div>
              <button
                className="mt-2 px-4 py-2 bg-[var(--main-color)] text-white font-semibold tracking-tight border-none hover:opacity-90 transition rounded-none"
                onClick={handleDecode}
                type="button"
                style={{ borderRadius: 0, maxWidth: 160 }}
              >
                Decode
              </button>
              {error && (
                <div className="text-red-500 text-sm mt-2 whitespace-pre-line">{error}</div>
              )}
              {decoded && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                      Decoded output
                    </span>
                    <button
                      type="button"
                      className="p-1 bg-transparent border-none outline-none flex items-center justify-center h-6 w-6"
                      onClick={handleCopy}
                      tabIndex={-1}
                      aria-label="Copy decoded output"
                    >
                      <CopyIcon copied={copied} />
                    </button>
                  </div>
                  <pre className="bg-neutral-100 dark:bg-neutral-900 px-3 py-2 border border-neutral-200 dark:border-neutral-800 text-sm font-mono select-all overflow-x-auto rounded-none">
                    {JSON.stringify(decoded, bigIntReplacer, 2)}
                  </pre>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
