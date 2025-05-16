"use client";
import { useEffect, useState } from "react";

function pad(n: number) {
  return n.toString().padStart(2, "0");
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

export default function UnixUtcPage() {
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
  const [copiedNow, setCopiedNow] = useState(false);
  const [epochInput, setEpochInput] = useState("");
  const [utcResult, setUtcResult] = useState("");
  const [copiedUtc, setCopiedUtc] = useState(false);
  const [utcFields, setUtcFields] = useState({
    sec: "0",
    min: "0",
    hr: "0",
    day: "0",
    mon: "0",
    year: "0",
  });
  const [epochFromUtc, setEpochFromUtc] = useState("");
  const [copiedEpochFromUtc, setCopiedEpochFromUtc] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function handleEpochConvert() {
    if (!epochInput || isNaN(Number(epochInput))) {
      setUtcResult("");
      return;
    }
    const d = new Date(Number(epochInput) * 1000);
    setUtcResult(
      `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())} UTC`,
    );
  }

  function handleUtcConvert() {
    const { sec, min, hr, day, mon, year } = utcFields;
    if ([sec, min, hr, day, mon, year].some((v) => isNaN(Number(v)))) {
      setEpochFromUtc("");
      return;
    }
    const d = new Date(
      Date.UTC(
        Number(year),
        Number(mon) - 1,
        Number(day),
        Number(hr),
        Number(min),
        Number(sec),
      ),
    );
    setEpochFromUtc(Math.floor(d.getTime() / 1000).toString());
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-2xl mx-auto min-h-screen px-6 py-12">
        <main className="space-y-16">
          <section className="space-y-8">
            <h1 className="text-3xl font-bold text-[var(--main-color)] tracking-tight">
              Unix Epoch - UTC Conversion
            </h1>
            <div className="mt-6">
              <div className="text-lg font-medium mb-2">
                Current unix epoch time
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-2xl font-mono bg-neutral-100 dark:bg-neutral-900 px-4 py-2 border border-neutral-200 dark:border-neutral-800 select-all"
                  style={{ borderRadius: 0 }}
                >
                  {now}
                </span>
                <button
                  type="button"
                  className="p-1 bg-transparent border-none outline-none flex items-center justify-center h-6 w-6"
                  onClick={async (e) => {
                    e.preventDefault();
                    await navigator.clipboard.writeText(now.toString());
                    setCopiedNow(true);
                    setTimeout(() => setCopiedNow(false), 1200);
                  }}
                  aria-label="Copy current unix epoch time"
                  tabIndex={-1}
                >
                  <CopyIcon copied={copiedNow} />
                </button>
              </div>
            </div>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Unix Epoch to UTC */}
              <div className="space-y-4">
                <div className="font-semibold text-neutral-700 dark:text-neutral-300 tracking-tight">
                  Convert Unix Epoch to UTC
                </div>
                <label
                  className="block text-sm font-medium mb-1"
                  htmlFor="epochInput"
                >
                  UnixEpoch
                </label>
                <input
                  id="epochInput"
                  type="text"
                  inputMode="numeric"
                  className="w-full px-4 py-3 border-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:border-b-2 focus:border-[var(--main-color)] text-lg font-mono rounded-none"
                  value={epochInput}
                  onChange={(e) =>
                    setEpochInput(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  placeholder="0"
                  autoComplete="off"
                  style={{ borderRadius: 0 }}
                />
                <button
                  className="mt-2 px-4 py-2 bg-[var(--main-color)] text-white font-semibold tracking-tight border-none hover:opacity-90 transition rounded-none"
                  onClick={handleEpochConvert}
                  type="button"
                  style={{ borderRadius: 0 }}
                >
                  Convert
                </button>
                {utcResult && (
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className="text-base font-mono bg-neutral-100 dark:bg-neutral-900 px-3 py-2 border border-neutral-200 dark:border-neutral-800 select-all"
                      style={{ borderRadius: 0 }}
                    >
                      {utcResult}
                    </span>
                    <button
                      type="button"
                      className="p-1 bg-transparent border-none outline-none flex items-center justify-center h-6 w-6"
                      onClick={async (e) => {
                        e.preventDefault();
                        await navigator.clipboard.writeText(utcResult);
                        setCopiedUtc(true);
                        setTimeout(() => setCopiedUtc(false), 1200);
                      }}
                      aria-label="Copy UTC result"
                      tabIndex={-1}
                    >
                      <CopyIcon copied={copiedUtc} />
                    </button>
                  </div>
                )}
              </div>
              {/* UTC to Unix Epoch */}
              <div className="space-y-4">
                <div className="font-semibold text-neutral-700 dark:text-neutral-300 tracking-tight">
                  Convert UTC to Unix Epoch
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium" htmlFor="sec">
                      sec
                    </label>
                    <input
                      id="sec"
                      type="number"
                      min="0"
                      max="59"
                      className="w-full px-2 py-1 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-none"
                      value={utcFields.sec}
                      onChange={(e) =>
                        setUtcFields((f) => ({ ...f, sec: e.target.value }))
                      }
                      style={{ borderRadius: 0 }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium" htmlFor="min">
                      min
                    </label>
                    <input
                      id="min"
                      type="number"
                      min="0"
                      max="59"
                      className="w-full px-2 py-1 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-none"
                      value={utcFields.min}
                      onChange={(e) =>
                        setUtcFields((f) => ({ ...f, min: e.target.value }))
                      }
                      style={{ borderRadius: 0 }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium" htmlFor="hr">
                      hr
                    </label>
                    <input
                      id="hr"
                      type="number"
                      min="0"
                      max="23"
                      className="w-full px-2 py-1 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-none"
                      value={utcFields.hr}
                      onChange={(e) =>
                        setUtcFields((f) => ({ ...f, hr: e.target.value }))
                      }
                      style={{ borderRadius: 0 }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium" htmlFor="day">
                      day
                    </label>
                    <input
                      id="day"
                      type="number"
                      min="1"
                      max="31"
                      className="w-full px-2 py-1 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-none"
                      value={utcFields.day}
                      onChange={(e) =>
                        setUtcFields((f) => ({ ...f, day: e.target.value }))
                      }
                      style={{ borderRadius: 0 }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium" htmlFor="mon">
                      mon
                    </label>
                    <input
                      id="mon"
                      type="number"
                      min="1"
                      max="12"
                      className="w-full px-2 py-1 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-none"
                      value={utcFields.mon}
                      onChange={(e) =>
                        setUtcFields((f) => ({ ...f, mon: e.target.value }))
                      }
                      style={{ borderRadius: 0 }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium" htmlFor="year">
                      year
                    </label>
                    <input
                      id="year"
                      type="number"
                      min="1970"
                      max="3000"
                      className="w-full px-2 py-1 border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 rounded-none"
                      value={utcFields.year}
                      onChange={(e) =>
                        setUtcFields((f) => ({ ...f, year: e.target.value }))
                      }
                      style={{ borderRadius: 0 }}
                    />
                  </div>
                </div>
                <button
                  className="mt-2 px-4 py-2 bg-[var(--main-color)] text-white font-semibold tracking-tight border-none hover:opacity-90 transition rounded-none"
                  onClick={handleUtcConvert}
                  type="button"
                  style={{ borderRadius: 0 }}
                >
                  Convert
                </button>
                {epochFromUtc && (
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className="text-base font-mono bg-neutral-100 dark:bg-neutral-900 px-3 py-2 border border-neutral-200 dark:border-neutral-800 select-all"
                      style={{ borderRadius: 0 }}
                    >
                      {epochFromUtc}
                    </span>
                    <button
                      type="button"
                      className="p-1 bg-transparent border-none outline-none flex items-center justify-center h-6 w-6"
                      onClick={async (e) => {
                        e.preventDefault();
                        await navigator.clipboard.writeText(epochFromUtc);
                        setCopiedEpochFromUtc(true);
                        setTimeout(() => setCopiedEpochFromUtc(false), 1200);
                      }}
                      aria-label="Copy Unix epoch result"
                      tabIndex={-1}
                    >
                      <CopyIcon copied={copiedEpochFromUtc} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
