import { useState, useEffect, useCallback } from "react";

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap');

  :root {
    --bg: #040a0f;
    --panel: #080f18;
    --border: #0d2235;
    --accent: #00c8ff;
    --accent2: #ff6b35;
    --gold: #ffd700;
    --green: #00ff88;
    --red: #ff3355;
    --muted: #2a4a5e;
    --text: #a8d4e6;
    --dim: #3d6070;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: var(--bg); color: var(--text); font-family: 'Share Tech Mono', monospace; min-height: 100vh; }

  .app { max-width: 900px; margin: 0 auto; padding: 20px 16px 60px; }

  /* header */
  .header { text-align: center; margin-bottom: 28px; position: relative; padding-top: 12px; }
  .header::before {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    margin-bottom: 18px;
  }
  .header h1 {
    font-family: 'Orbitron', sans-serif;
    font-size: clamp(1.4rem, 5vw, 2.2rem);
    font-weight: 900;
    letter-spacing: 0.12em;
    color: #fff;
    text-shadow: 0 0 20px var(--accent), 0 0 40px rgba(0,200,255,0.3);
  }
  .header .sub {
    font-size: 0.72rem;
    color: var(--dim);
    letter-spacing: 0.3em;
    margin-top: 6px;
  }
  .scanline {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,200,255,0.015) 2px, rgba(0,200,255,0.015) 4px);
    pointer-events: none;
  }

  /* tabs */
  .tabs { display: flex; gap: 2px; margin-bottom: 20px; border-bottom: 1px solid var(--border); }
  .tab {
    padding: 10px 20px;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--dim);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.15em;
    cursor: pointer;
    transition: all 0.2s;
  }
  .tab:hover { color: var(--text); }
  .tab.active { color: var(--accent); border-bottom-color: var(--accent); }

  /* panel */
  .panel {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 20px;
    margin-bottom: 16px;
    position: relative;
    overflow: hidden;
  }
  .panel::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent) 40%, transparent);
    opacity: 0.4;
  }
  .panel-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 0.65rem;
    letter-spacing: 0.3em;
    color: var(--accent);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .panel-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* form */
  .form-grid { display: grid; gap: 12px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  label { display: block; font-size: 0.68rem; color: var(--dim); letter-spacing: 0.2em; margin-bottom: 6px; }
  input, select {
    width: 100%;
    background: rgba(0,200,255,0.04);
    border: 1px solid var(--border);
    border-radius: 3px;
    color: var(--text);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.85rem;
    padding: 10px 12px;
    outline: none;
    transition: border-color 0.2s;
  }
  input:focus, select:focus { border-color: var(--accent); }
  select option { background: #080f18; }

  .textarea-wrap textarea {
    width: 100%;
    background: rgba(0,200,255,0.04);
    border: 1px solid var(--border);
    border-radius: 3px;
    color: var(--text);
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.82rem;
    padding: 10px 12px;
    outline: none;
    resize: vertical;
    min-height: 80px;
    transition: border-color 0.2s;
  }
  .textarea-wrap textarea:focus { border-color: var(--accent); }

  .hint { font-size: 0.65rem; color: var(--dim); margin-top: 4px; }

  /* buttons */
  .btn {
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.78rem;
    letter-spacing: 0.15em;
    padding: 11px 24px;
    border-radius: 3px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-primary {
    background: var(--accent);
    color: #000;
    font-weight: bold;
  }
  .btn-primary:hover { background: #33d4ff; box-shadow: 0 0 20px rgba(0,200,255,0.4); }
  .btn-danger {
    background: transparent;
    border: 1px solid var(--red);
    color: var(--red);
    font-size: 0.7rem;
    padding: 6px 12px;
  }
  .btn-danger:hover { background: rgba(255,51,85,0.1); }
  .btn-gen {
    background: linear-gradient(135deg, #00c8ff, #0070aa);
    color: #000;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    padding: 14px 32px;
    border-radius: 3px;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    width: 100%;
  }
  .btn-gen:hover { box-shadow: 0 0 30px rgba(0,200,255,0.5); transform: translateY(-1px); }

  /* predictions */
  .pred-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 4px; }
  .pred-block { }
  .pred-label {
    font-family: 'Orbitron', sans-serif;
    font-size: 0.6rem;
    letter-spacing: 0.3em;
    color: var(--accent2);
    margin-bottom: 10px;
  }
  .pred-numbers { display: flex; flex-wrap: wrap; gap: 8px; }
  .pred-num {
    background: rgba(255,107,53,0.1);
    border: 1px solid rgba(255,107,53,0.3);
    color: #fff;
    padding: 8px 14px;
    border-radius: 3px;
    font-size: 1.1rem;
    letter-spacing: 0.15em;
    font-weight: bold;
    position: relative;
  }
  .pred-num.pm9 {
    background: rgba(0,200,255,0.08);
    border-color: rgba(0,200,255,0.25);
  }
  .endings-row {
    display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; padding-top: 12px;
    border-top: 1px solid var(--border);
  }
  .ending-chip {
    background: rgba(255,215,0,0.08);
    border: 1px solid rgba(255,215,0,0.25);
    color: var(--gold);
    padding: 4px 10px;
    border-radius: 2px;
    font-size: 0.75rem;
    letter-spacing: 0.1em;
  }
  .ending-label { font-size: 0.65rem; color: var(--dim); letter-spacing: 0.2em; margin-right: 4px; align-self: center; }

  /* history */
  .history-list { display: flex; flex-direction: column; gap: 10px; }
  .hist-entry {
    background: rgba(13,34,53,0.5);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 12px 14px;
    display: flex;
    gap: 14px;
    align-items: flex-start;
  }
  .hist-meta { min-width: 100px; }
  .hist-date { font-size: 0.7rem; color: var(--accent); }
  .hist-type {
    display: inline-block;
    margin-top: 4px;
    font-size: 0.62rem;
    letter-spacing: 0.2em;
    padding: 2px 8px;
    border-radius: 2px;
  }
  .hist-type.pm3 { background: rgba(255,107,53,0.15); color: var(--accent2); border: 1px solid rgba(255,107,53,0.3); }
  .hist-type.pm9 { background: rgba(0,200,255,0.08); color: var(--accent); border: 1px solid rgba(0,200,255,0.2); }
  .hist-nums { display: flex; flex-wrap: wrap; gap: 6px; flex: 1; }
  .hist-num {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    padding: 4px 10px;
    border-radius: 2px;
    font-size: 0.82rem;
    color: #c0dae8;
  }
  .hist-num.top { color: var(--gold); border-color: rgba(255,215,0,0.3); }
  .hist-actions { display: flex; gap: 8px; align-items: center; }

  /* toast */
  .toast {
    position: fixed;
    bottom: 24px; left: 50%;
    transform: translateX(-50%) translateY(80px);
    background: var(--green);
    color: #000;
    font-family: 'Share Tech Mono', monospace;
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    padding: 10px 24px;
    border-radius: 3px;
    transition: transform 0.3s ease;
    z-index: 999;
    pointer-events: none;
  }
  .toast.show { transform: translateX(-50%) translateY(0); }

  /* stats */
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; }
  .stat-box {
    background: rgba(0,200,255,0.04);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 14px;
    text-align: center;
  }
  .stat-val { font-family: 'Orbitron', sans-serif; font-size: 1.6rem; color: #fff; }
  .stat-lbl { font-size: 0.62rem; color: var(--dim); letter-spacing: 0.2em; margin-top: 4px; }

  .empty { color: var(--dim); font-size: 0.78rem; letter-spacing: 0.1em; text-align: center; padding: 24px; }

  .budget-box {
    background: rgba(0,255,136,0.06);
    border: 1px solid rgba(0,255,136,0.2);
    border-radius: 3px;
    padding: 10px 14px;
    font-size: 0.72rem;
    color: var(--green);
    letter-spacing: 0.12em;
    margin-top: 12px;
    text-align: center;
  }

  @media (max-width: 500px) {
    .pred-grid { grid-template-columns: 1fr; }
    .form-row { grid-template-columns: 1fr; }
    .hist-entry { flex-direction: column; gap: 8px; }
  }
`;

// ─── Utility ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = "j2_lottery_v1";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { history: [], topEndings: ["07", "58", "77", "49", "15"] };
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

function hybridEnding(e1, e2) { return e1[0] + e2[1]; }

function updateEndings(history) {
  const recent = history.slice(-6);
  const endings = [];
  for (const entry of recent.slice(-3)) {
    for (const num of entry.results) {
      if (num.length === 4) endings.push(num.slice(-2));
    }
  }
  if (!endings.length) return ["07","58","77","49","15"];
  const counts = {};
  endings.forEach(e => counts[e] = (counts[e] || 0) + 1);
  return Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0,5).map(e => e[0]);
}

function generatePredictions(history, topEndings) {
  const recentWinners = [];
  for (const entry of history.slice(-6)) {
    if (entry.results.length) recentWinners.push(...entry.results.slice(0,3));
  }

  const rnd = arr => arr[Math.floor(Math.random() * arr.length)];
  const rndInt = (n) => String(Math.floor(Math.random() * n)).padStart(2, "0");

  const pm3 = new Set();
  while (pm3.size < 3) {
    const base = recentWinners.length ? rnd(recentWinners).slice(0,2) : rndInt(100);
    pm3.add(base + rnd(topEndings));
  }

  const pm9 = new Set();
  while (pm9.size < 3) {
    const prefix = rndInt(100);
    let ending;
    if (topEndings.length >= 2) {
      const [e1, e2] = [...topEndings].sort(() => Math.random()-0.5).slice(0,2);
      ending = hybridEnding(e1, e2);
    } else {
      ending = rnd(topEndings);
    }
    pm9.add(prefix + ending);
  }

  return { pm3: [...pm3], pm9: [...pm9] };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function App() {
  const [state, setState] = useState(() => loadState());
  const [tab, setTab] = useState("add");
  const [predictions, setPredictions] = useState(null);
  const [toast, setToast] = useState({ msg: "", show: false });

  // form state
  const [drawType, setDrawType] = useState("3pm");
  const [date, setDate] = useState(() => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
  });
  const [numbers, setNumbers] = useState("");

  const showToast = (msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2200);
  };

  const handleAdd = () => {
    const results = numbers.split(",").map(s => s.trim()).filter(s => s.length === 4 && /^\d+$/.test(s));
    if (!results.length) { showToast("⚠ Enter valid 4-digit numbers"); return; }
    if (!date.match(/^\d{2}\/\d{2}\/\d{4}$/)) { showToast("⚠ Date format: DD/MM/YYYY"); return; }

    const newHistory = [...state.history, { date, type: drawType, results }];
    const newEndings = updateEndings(newHistory);
    const newState = { history: newHistory, topEndings: newEndings };
    setState(newState);
    saveState(newState);
    setNumbers("");
    setPredictions(null);
    showToast(`✓ ADDED ${results.length} NUMBERS`);
  };

  const handleDelete = (idx) => {
    const newHistory = state.history.filter((_, i) => i !== idx);
    const newEndings = updateEndings(newHistory);
    const newState = { history: newHistory, topEndings: newEndings };
    setState(newState);
    saveState(newState);
  };

  const handleGenerate = () => {
    const preds = generatePredictions(state.history, state.topEndings);
    setPredictions(preds);
    setTab("predict");
  };

  const totalDraws = state.history.length;
  const totalNumbers = state.history.reduce((a,e) => a + e.results.length, 0);
  const days3pm = state.history.filter(e => e.type === "3pm").length;
  const days9pm = state.history.filter(e => e.type === "9pm").length;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <div className="scanline" />
          <h1>JAGUAR-2 PREDICTOR</h1>
          <div className="sub">LOTTERY PATTERN ANALYSIS SYSTEM v3.0</div>
        </div>

        <div className="tabs">
          {[["add","+ ADD RESULTS"],["predict","⬡ PREDICTIONS"],["history","◈ HISTORY"],["stats","▲ STATS"]].map(([k,l]) => (
            <button key={k} className={`tab ${tab===k?"active":""}`} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>

        {/* ── ADD RESULTS ── */}
        {tab === "add" && (
          <div className="panel">
            <div className="panel-title">INPUT DRAW RESULTS</div>
            <div className="form-grid">
              <div className="form-row">
                <div>
                  <label>DRAW TYPE</label>
                  <select value={drawType} onChange={e => setDrawType(e.target.value)}>
                    <option value="3pm">3PM DRAW</option>
                    <option value="9pm">9PM DRAW</option>
                  </select>
                </div>
                <div>
                  <label>DATE</label>
                  <input value={date} onChange={e => setDate(e.target.value)} placeholder="DD/MM/YYYY" />
                </div>
              </div>
              <div className="textarea-wrap">
                <label>NUMBERS (4-digit, comma-separated)</label>
                <textarea
                  value={numbers}
                  onChange={e => setNumbers(e.target.value)}
                  placeholder="e.g. 1234, 5678, 9012, 3456..."
                />
                <div className="hint">Enter all prize numbers from the draw. First 3 are treated as top prizes.</div>
              </div>
              <button className="btn btn-primary" onClick={handleAdd}>SUBMIT RESULTS</button>
            </div>
          </div>
        )}

        {/* ── PREDICTIONS ── */}
        {tab === "predict" && (
          <>
            <div className="panel">
              <div className="panel-title">PREDICTION ENGINE</div>
              <button className="btn-gen" onClick={handleGenerate}>
                ⬡ GENERATE PREDICTIONS
              </button>
              {predictions && (
                <>
                  <div className="pred-grid" style={{marginTop:20}}>
                    <div className="pred-block">
                      <div className="pred-label">3PM DRAW</div>
                      <div className="pred-numbers">
                        {predictions.pm3.map((n,i) => <span key={i} className="pred-num">{n}</span>)}
                      </div>
                    </div>
                    <div className="pred-block">
                      <div className="pred-label">9PM DRAW</div>
                      <div className="pred-numbers">
                        {predictions.pm9.map((n,i) => <span key={i} className="pred-num pm9">{n}</span>)}
                      </div>
                    </div>
                  </div>
                  <div className="endings-row">
                    <span className="ending-label">TOP ENDINGS:</span>
                    {state.topEndings.map((e,i) => <span key={i} className="ending-chip">{e}</span>)}
                  </div>
                  <div className="budget-box">
                    ◈ BUDGET RECOMMENDATION: $6 — $1 PER NUMBER (6 TOTAL)
                  </div>
                </>
              )}
              {!predictions && (
                <div className="empty" style={{marginTop:16}}>
                  Press GENERATE to compute next draw predictions
                </div>
              )}
            </div>
            <div className="panel">
              <div className="panel-title">ALGORITHM LOGIC</div>
              <div style={{fontSize:"0.72rem",color:"var(--dim)",lineHeight:1.9,letterSpacing:"0.05em"}}>
                <div>◈ <span style={{color:"var(--text)"}}>3PM METHOD:</span> Recent winner prefix (last 3 days) + top ending from frequency table</div>
                <div>◈ <span style={{color:"var(--text)"}}>9PM METHOD:</span> Random prefix + hybrid ending (blend of 2 top endings)</div>
                <div>◈ <span style={{color:"var(--text)"}}>TOP ENDINGS:</span> Derived from last 3 days of draw results (last 2 digits frequency)</div>
              </div>
            </div>
          </>
        )}

        {/* ── HISTORY ── */}
        {tab === "history" && (
          <div className="panel">
            <div className="panel-title">DRAW HISTORY ({state.history.length} ENTRIES)</div>
            {state.history.length === 0
              ? <div className="empty">No draw data yet. Add results to begin.</div>
              : (
                <div className="history-list">
                  {[...state.history].reverse().map((entry, ri) => {
                    const idx = state.history.length - 1 - ri;
                    return (
                      <div key={idx} className="hist-entry">
                        <div className="hist-meta">
                          <div className="hist-date">{entry.date}</div>
                          <span className={`hist-type ${entry.type}`}>{entry.type.toUpperCase()}</span>
                        </div>
                        <div className="hist-nums">
                          {entry.results.map((n,i) => (
                            <span key={i} className={`hist-num ${i < 3 ? "top" : ""}`}>{n}</span>
                          ))}
                        </div>
                        <button className="btn btn-danger" onClick={() => handleDelete(idx)}>DEL</button>
                      </div>
                    );
                  })}
                </div>
              )}
          </div>
        )}

        {/* ── STATS ── */}
        {tab === "stats" && (
          <>
            <div className="panel">
              <div className="panel-title">DATASET OVERVIEW</div>
              <div className="stats-grid">
                <div className="stat-box"><div className="stat-val">{totalDraws}</div><div className="stat-lbl">TOTAL DRAWS</div></div>
                <div className="stat-box"><div className="stat-val">{totalNumbers}</div><div className="stat-lbl">NUMBERS LOGGED</div></div>
                <div className="stat-box"><div className="stat-val">{days3pm}</div><div className="stat-lbl">3PM DRAWS</div></div>
                <div className="stat-box"><div className="stat-val">{days9pm}</div><div className="stat-lbl">9PM DRAWS</div></div>
              </div>
            </div>
            <div className="panel">
              <div className="panel-title">CURRENT TOP ENDINGS</div>
              <div className="endings-row" style={{marginTop:0}}>
                {state.topEndings.map((e,i) => (
                  <span key={i} className="ending-chip" style={{fontSize:"1rem",padding:"8px 18px"}}>
                    {e}
                  </span>
                ))}
              </div>
              <div className="hint" style={{marginTop:12}}>Derived from last 3 days of draw data. Updates automatically on each submission.</div>
            </div>
            {state.history.length > 0 && (() => {
              const allDigits = state.history.flatMap(e => e.results.flatMap(n => n.split("").map(Number)));
              const freq = Array(10).fill(0);
              allDigits.forEach(d => freq[d]++);
              const max = Math.max(...freq);
              return (
                <div className="panel">
                  <div className="panel-title">DIGIT FREQUENCY</div>
                  <div style={{display:"flex",gap:"6px",alignItems:"flex-end",height:"80px"}}>
                    {freq.map((f,d) => (
                      <div key={d} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"4px"}}>
                        <div style={{
                          width:"100%",
                          height: max ? `${(f/max)*60}px` : "4px",
                          background: f === max ? "var(--gold)" : "var(--accent)",
                          opacity: 0.7,
                          borderRadius:"2px 2px 0 0",
                          transition:"height 0.4s"
                        }}/>
                        <span style={{fontSize:"0.65rem",color:"var(--dim)"}}>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </div>

      <div className={`toast ${toast.show ? "show" : ""}`}>{toast.msg}</div>
    </>
  );
}