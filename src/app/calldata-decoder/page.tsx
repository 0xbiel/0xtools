"use client";
import { useState, useMemo } from "react";
import { decodeFunctionData, parseAbi } from "viem";

let decodeCalldata: (calldata: string, abi: string) => any = () => null;

try {
  decodeCalldata = (calldata: string, abi: string) => {
    try {
      const parsedAbi = parseAbi(JSON.parse(abi));
      // Ensure calldata is a valid hex string with 0x prefix
      if (!calldata.startsWith('0x')) {
        throw new Error('Calldata must start with 0x');
      }
      const result = decodeFunctionData({ abi: parsedAbi, data: calldata as `0x${string}` });
      return result;
    } catch (e) {
      return { error: (e as any).message || String(e) };
    }
  };
} catch {}

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

function get4ByteSelector(calldata: string) {
  if (!calldata || !/^0x[0-9a-fA-F]{8,}/.test(calldata)) return "";
  return calldata.slice(0, 10);
}

export default function CalldataDecoder() {
  const [calldata, setCalldata] = useState("");
  const [abi, setAbi] = useState("");
  const [decoded, setDecoded] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<'abi' | '4bytes'>("abi");

  const selector = useMemo(() => get4ByteSelector(calldata), [calldata]);

  const handleDecode = () => {
    setError("");
    setDecoded(null);
    if (tab === "abi") {
      try {
        const result = decodeCalldata(calldata, abi);
        if (result && result.error) setError(result.error);
        else setDecoded(result);
      } catch (e: any) {
        setError(e.message || String(e));
      }
    } else {
      setError("4byte directory lookup not implemented in this demo.");
    }
  };

  const handleCopy = async () => {
    if (!decoded) return;
    await navigator.clipboard.writeText(JSON.stringify(decoded, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-2xl mx-auto min-h-screen px-6 py-12">
        <main className="space-y-16">
          <section className="space-y-6">
            <h1 className="text-3xl font-bold text-[var(--main-color)]">
              Calldata Decoder
            </h1>
            <p className="text-lg text-neutral-700 dark:text-neutral-300">
              Decode Ethereum calldata using an ABI or view the 4byte selector. Enter calldata and ABI below, then decode.
            </p>
            <div className="flex gap-4 mt-4">
              <button
                className={`px-4 py-2 border-b-2 ${tab === "abi" ? "border-[var(--main-color)] font-bold" : "border-transparent"}`}
                onClick={() => setTab("abi")}
                type="button"
              >
                ABI
              </button>
              <button
                className={`px-4 py-2 border-b-2 ${tab === "4bytes" ? "border-[var(--main-color)] font-bold" : "border-transparent"}`}
                onClick={() => setTab("4bytes")}
                type="button"
              >
                4byte
              </button>
            </div>
            <div className="flex flex-col gap-5 mt-8">
              <div className="flex flex-col">
                <label htmlFor="calldata" className="text-sm font-medium">
                  Calldata
                </label>
                <textarea
                  id="calldata"
                  className="w-full px-4 py-3 border-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:border-b-2 focus:border-[var(--main-color)] text-lg font-mono rounded-none min-h-[48px]"
                  value={calldata}
                  onChange={e => setCalldata(e.target.value)}
                  placeholder="e.g 0x23b8..3b2"
                  autoComplete="off"
                  style={{ minHeight: 48 }}
                />
              </div>
              {tab === "abi" && (
                <div className="flex flex-col">
                  <label htmlFor="abi" className="text-sm font-medium">
                    ABI
                  </label>
                  <textarea
                    id="abi"
                    className="w-full px-4 py-3 border-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:border-b-2 focus:border-[var(--main-color)] text-lg font-mono rounded-none min-h-[48px]"
                    value={abi}
                    onChange={e => setAbi(e.target.value)}
                    placeholder="Paste contract ABI JSON here"
                    autoComplete="off"
                    style={{ minHeight: 48 }}
                  />
                </div>
              )}
              {tab === "4bytes" && selector && (
                <div className="flex flex-col mt-2">
                  <span className="text-sm font-medium">4byte selector</span>
                  <span className="text-base font-mono bg-neutral-100 dark:bg-neutral-900 px-3 py-2 border border-neutral-200 dark:border-neutral-800 select-all rounded-none mt-1">
                    {selector}
                  </span>
                </div>
              )}
              <button
                className="mt-2 px-4 py-2 bg-[var(--main-color)] text-white font-semibold tracking-tight border-none hover:opacity-90 transition rounded-none"
                onClick={handleDecode}
                type="button"
                style={{ borderRadius: 0, maxWidth: 160 }}
              >
                Decode
              </button>
              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
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
                    {JSON.stringify(decoded, null, 2)}
                  </pre>
                </div>
              )}
              {tab === "4bytes" && !selector && (
                <div className="text-neutral-500 text-sm mt-2">Enter calldata to see the 4byte selector.</div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
