import { useState, useEffect } from "react";
import StockTable from "./components/StockTable";

function App() {
  const [query, setQuery] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("watchlist");
      return saved ? JSON.parse(saved) : ["AAPL", "TSLA", "NVDA"];
    } catch {
      return ["AAPL", "TSLA", "NVDA"];
    }
  });

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const sym = query.trim().toUpperCase();
    if (!sym || sym === selectedSymbol) return;
    setIsSearching(true);
    setSelectedSymbol(sym);
  }

  function addToWatchlist() {
    if (!selectedSymbol || watchlist.includes(selectedSymbol)) return;
    setWatchlist([...watchlist, selectedSymbol]);
  }

  function removeFromWatchlist(sym: string) {
    setWatchlist(watchlist.filter((s) => s !== sym));
  }

  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const dateStr = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }).toUpperCase();

  return (
    <div className="td-app">
      {/* Top Bar */}
      <header className="td-header">
        <div className="td-header-inner">
          <div className="td-logo">
            <span className="td-logo-icon">◈</span>
            <span className="td-logo-text">TRADE<span>DASH</span></span>
          </div>
          <div className="td-header-meta">
            <span className="td-time">{timeStr}</span>
            <span className="td-date">{dateStr}</span>
            <span className="td-status-dot" />
            <span className="td-label">LIVE</span>
          </div>
        </div>
      </header>

      <main className="td-main">
        {/* Left Sidebar: Watchlist */}
        <aside className="td-sidebar">
          <div className="td-sidebar-title">WATCHLIST</div>

          {watchlist.length === 0 && (
            <p className="td-empty">No symbols tracked.</p>
          )}

          <div className="td-watchlist">
            {watchlist.map((sym) => (
              <div
                key={sym}
                className={`td-watchlist-item ${selectedSymbol === sym ? "active" : ""}`}
                onClick={() => {
                  setIsSearching(true);
                  setSelectedSymbol(sym);
                }}
              >
                <span className="td-watchlist-sym">{sym}</span>
                <button
                  className="td-remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWatchlist(sym);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Search in sidebar */}
          <div className="td-sidebar-section">
            <div className="td-sidebar-title" style={{ marginTop: "2rem" }}>SEARCH</div>
            <form onSubmit={handleSearch} className="td-search-form">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value.toUpperCase())}
                placeholder="e.g. AAPL"
                className="td-input"
                maxLength={10}
              />
              <button type="submit" className="td-btn-primary" disabled={isSearching}>
                {isSearching ? "…" : "GO"}
              </button>
            </form>

            {selectedSymbol && (
              <button
                className="td-btn-secondary"
                onClick={addToWatchlist}
                disabled={watchlist.includes(selectedSymbol)}
              >
                {watchlist.includes(selectedSymbol) ? "✓ In Watchlist" : "+ Add to Watchlist"}
              </button>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <section className="td-content">
          {!selectedSymbol ? (
            <div className="td-welcome">
              <div className="td-welcome-icon">◈</div>
              <h2>Select a symbol to begin</h2>
              <p>Search for a ticker or pick one from your watchlist.</p>
            </div>
          ) : (
            <StockTable
              symbol={selectedSymbol}
              onLoaded={() => setIsSearching(false)}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;