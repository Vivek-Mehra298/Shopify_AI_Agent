import { useEffect, useRef, useState } from "react";
import { saveAs } from "file-saver";
import { runShopifyAgent } from "@/agent/orchestrator";
import type { AgentState, AgentStage, StageLog } from "@/agent/types";

const API_KEY_STORAGE_KEY = "groq_api_key";
const looksLikeGroqKey = (key: string) => key.trim().startsWith("gsk_");

const STAGE_LABELS: Record<AgentStage, string> = {
  idle: "Idle",
  parsing: "1. Parsing Brief",
  researching: "2. Market Research",
  branding: "3. Brand Strategy",
  writing: "4. Writing Content",
  building: "5. Shopify Schema",
  done: "Complete ✓",
  error: "Error",
};

const STAGE_ORDER: AgentStage[] = ["parsing", "researching", "branding", "writing", "building", "done"];

const DEFAULT_BRIEF = `We want to sell premium handcrafted soy candles targeting urban women aged 25-40 in India. Brand name is 'Lumière'. Products are scented candles in luxury packaging — price range ₹599 to ₹2,499. We want to feel like a modern, minimal luxury brand, similar to Forest Essentials but for home fragrance. We need a homepage, a collections page, and 3 sample product listings.`;

export default function AgentRunner() {
  const [brief, setBrief] = useState(DEFAULT_BRIEF);
  const [apiKey, setApiKey] = useState(() => {
    const saved = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (saved) return saved;
    return import.meta.env.VITE_GROQ_API_KEY ?? "";
  });
  const [running, setRunning] = useState(false);
  const [currentStage, setCurrentStage] = useState<AgentStage>("idle");
  const [logs, setLogs] = useState<StageLog[]>([]);
  const [result, setResult] = useState<AgentState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      return;
    }
    localStorage.setItem(API_KEY_STORAGE_KEY, trimmed);
  }, [apiKey]);

  const addLog = (log: StageLog) => {
    setLogs((prev) => [...prev, log]);
    setTimeout(() => logsEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const handleRun = async () => {
    if (!apiKey.trim()) return alert("Enter your Groq API key first");
    if (!looksLikeGroqKey(apiKey)) {
      return alert("That doesn't look like a Groq key. It should start with gsk_");
    }
    if (!brief.trim()) return alert("Enter a brief");
    setRunning(true);
    setLogs([]);
    setResult(null);
    setError(null);

    try {
      const state = await runShopifyAgent(brief, apiKey, (stage, log) => {
        setCurrentStage(stage);
        addLog(log);
      });
      setResult(state);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setRunning(false);
    }
  };

  const downloadJSON = (data: unknown, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    saveAs(blob, filename);
  };

  const stageIndex = STAGE_ORDER.indexOf(currentStage);

  return (
    <div className="min-h-screen bg-[#FAF8F5] font-sans">
      {/* Header */}
      <div className="border-b border-[#E5DFD6] bg-white px-8 py-5">
        <h1 className="font-serif text-2xl tracking-wide text-[#1C1C1A]">
          Lumière — Store Builder Agent
        </h1>
        <p className="mt-1 text-sm text-[#8A7E72]">
          AI-powered Shopify store generator
        </p>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8 space-y-6">
        {/* Input Panel */}
        <div className="rounded-xl border border-[#E5DFD6] bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#8A7E72]">
            Configuration
          </h2>

          <div className="space-y-4">
            <div>
                <label className="mb-1 block text-xs font-medium text-[#5C5249]">
                Groq API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full rounded-lg border border-[#DDD7CF] bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#1C1C1A] placeholder-[#C4BAB0] focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40"
              />
              <p className="mt-1 text-xs text-[#B0A498]">
                Key stays in your browser — never sent anywhere except api.groq.com
              </p>
              {apiKey.trim() && !looksLikeGroqKey(apiKey) && (
                <p className="mt-1 text-xs text-red-600">
                  This key format looks wrong. Groq keys usually start with <span className="font-mono">gsk_</span>.
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#5C5249]">
                Business Brief
              </label>
              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-[#DDD7CF] bg-[#FAF8F5] px-4 py-3 text-sm text-[#1C1C1A] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40 resize-none"
              />
            </div>

            <button
              onClick={handleRun}
              disabled={running}
              className="w-full rounded-lg bg-[#1C1C1A] py-3 text-sm font-medium tracking-wide text-white transition hover:bg-[#2E2E2B] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {running ? "Agent Running…" : "Run Agent"}
            </button>
          </div>
        </div>

        {/* Progress */}
        {(running || result) && (
          <div className="rounded-xl border border-[#E5DFD6] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#8A7E72]">
              Progress
            </h2>

            {/* Stage pills */}
            <div className="mb-5 flex flex-wrap gap-2">
              {STAGE_ORDER.map((s, i) => (
                <span
                  key={s}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    i < stageIndex
                      ? "bg-[#E8F5E9] text-[#2E7D32]"
                      : i === stageIndex
                      ? "bg-[#C9A96E]/20 text-[#8B6914] ring-1 ring-[#C9A96E]"
                      : "bg-[#F5F0EB] text-[#B0A498]"
                  }`}
                >
                  {STAGE_LABELS[s]}
                </span>
              ))}
            </div>

            {/* Log stream */}
            <div className="max-h-52 overflow-y-auto rounded-lg bg-[#1C1C1A] p-4 font-mono text-xs">
              {logs.map((log, i) => (
                <div
                  key={i}
                  className={`mb-1 ${
                    log.status === "done"
                      ? "text-[#7FBA00]"
                      : log.status === "error"
                      ? "text-[#FF6B6B]"
                      : "text-[#E8E2DA]"
                  }`}
                >
                  <span className="text-[#5C5249]">
                    [{new Date(log.timestamp).toLocaleTimeString()}]
                  </span>{" "}
                  {log.message}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            ❌ {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Downloads */}
            <div className="rounded-xl border border-[#E5DFD6] bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#8A7E72]">
                Downloads
              </h2>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Full Agent Output", key: "full", data: result },
                  { label: "Shopify Schema", key: "shopify", data: result.shopifySchema },
                  { label: "Research Report", key: "research", data: result.research },
                  { label: "Brand System", key: "brand", data: result.brand },
                  { label: "Store Content", key: "content", data: result.content },
                ].map((d) => (
                  <button
                    key={d.key}
                    onClick={() => downloadJSON(d.data, `lumiere_${d.key}.json`)}
                    className="rounded-lg border border-[#DDD7CF] bg-[#FAF8F5] px-4 py-2 text-xs font-medium text-[#5C5249] transition hover:bg-[#F0EBE4]"
                  >
                    ↓ {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Research Preview */}
            {result.research && (
              <div className="rounded-xl border border-[#E5DFD6] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#8A7E72]">
                  Competitor Analysis
                </h2>
                <div className="space-y-3">
                  {result.research.competitors.map((c, i) => (
                    <div key={i} className="rounded-lg bg-[#FAF8F5] p-4 text-sm">
                      <div className="font-semibold text-[#1C1C1A]">
                        {i + 1}. {c.name}
                        <a href={c.url} target="_blank" rel="noopener noreferrer"
                          className="ml-2 text-xs text-[#C9A96E] hover:underline">
                          {c.url}
                        </a>
                      </div>
                      <div className="mt-1 text-[#5C5249]">{c.positioning}</div>
                      <div className="mt-1 text-xs text-[#8A7E72]">
                        Price: {c.priceRange} · Gap: {c.gap}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Brand Colors */}
            {result.brand && (
              <div className="rounded-xl border border-[#E5DFD6] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#8A7E72]">
                  Brand Palette
                </h2>
                <div className="flex flex-wrap gap-3">
                  {result.brand.colors.map((c) => (
                    <div key={c.name} className="text-center">
                      <div
                        className="h-12 w-12 rounded-full shadow-md border border-white"
                        style={{ backgroundColor: c.hex }}
                      />
                      <div className="mt-1 text-xs font-mono text-[#5C5249]">{c.hex}</div>
                      <div className="text-xs text-[#8A7E72]">{c.name}</div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-[#5C5249]">{result.brand.designRationale}</p>
                <p className="mt-2 text-xs text-[#8A7E72]">
                  Fonts: <strong>{result.brand.fonts.display.name}</strong> (display) ×{" "}
                  <strong>{result.brand.fonts.body.name}</strong> (body)
                </p>
              </div>
            )}

            {/* Homepage Preview */}
            {result.content?.homepage && (
              <div className="rounded-xl border border-[#E5DFD6] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#8A7E72]">
                  Homepage Copy
                </h2>
                <div className="rounded-lg bg-[#1C1C1A] p-6 text-center">
                  <h1 className="font-serif text-3xl text-[#FAF8F5]">
                    {result.content.homepage.hero.headline}
                  </h1>
                  <p className="mt-3 text-sm text-[#B0A498] max-w-md mx-auto">
                    {result.content.homepage.hero.subheadline}
                  </p>
                  <button className="mt-5 rounded bg-[#C9A96E] px-6 py-2 text-xs font-medium tracking-widest text-[#1C1C1A] uppercase">
                    {result.content.homepage.hero.cta}
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  {result.content.homepage.valueProps.map((v, i) => (
                    <div key={i} className="rounded-lg bg-[#FAF8F5] p-3 text-center">
                      <div className="text-sm font-semibold text-[#1C1C1A]">{v.title}</div>
                      <div className="mt-1 text-xs text-[#8A7E72]">{v.description}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-lg bg-[#F5F0EB] p-4 text-center italic">
                  <p className="text-sm text-[#5C5249]">
                    "{result.content.homepage.socialProof.quote}"
                  </p>
                  <p className="mt-2 text-xs text-[#8A7E72]">
                    — {result.content.homepage.socialProof.author}
                  </p>
                </div>
              </div>
            )}

            {/* Product Cards */}
            {result.content?.products && (
              <div className="rounded-xl border border-[#E5DFD6] bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[#8A7E72]">
                  Product Listings ({result.content.products.length})
                </h2>
                <div className="space-y-4">
                  {result.content.products.map((p, i) => (
                    <div key={i} className="rounded-lg bg-[#FAF8F5] p-5">
                      <div className="flex items-start justify-between">
                        <h3 className="font-serif text-lg text-[#1C1C1A]">{p.name}</h3>
                        <span className="text-sm font-semibold text-[#C9A96E]">₹{p.price}</span>
                      </div>
                      <p className="mt-2 text-xs text-[#8A7E72]">
                        SKU: {p.sku} · {p.scentFamily} · Burns {p.burnTime}
                      </p>
                      <p className="mt-3 text-sm text-[#5C5249] leading-relaxed line-clamp-4">
                        {p.description}
                      </p>
                      <ul className="mt-3 space-y-1">
                        {p.features.slice(0, 3).map((f, j) => (
                          <li key={j} className="text-xs text-[#8A7E72]">
                            · {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
