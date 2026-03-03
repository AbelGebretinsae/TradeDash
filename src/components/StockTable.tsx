import { useEffect, useState } from "react";
import { fetchQuote } from "../api/finnhub";

type Stock = {
  symbol: string;
  price: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
};

type PricePoint = { time: string; price: number };

function Sparkline({ data, positive }: { data: PricePoint[]; positive: boolean }) {
  if (!data.length) return null;

  const W = 600, H = 160;
  const prices = data.map((d) => d.price);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const range = maxP - minP || 1;

  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((d.price - minP) / range) * (H * 0.9) - H * 0.05;
    return `${x},${y}`;
  });

  const polyline = pts.join(" ");
  const fillPath = `M${pts[0]} L${polyline.split(" ").slice(1).join(" ")} L${W},${H} L0,${H} Z`;

  const color = positive ? "#00e5a0" : "#ff4d6d";

  const lastPt = pts[pts.length - 1].split(",");

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      style={{ height: "160px" }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill="url(#areaGrad)" />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={lastPt[0]} cy={lastPt[1]} r="5" fill={color} />
      <circle cx={lastPt[0]} cy={lastPt[1]} r="9" fill={color} opacity="0.2" />
    </svg>
  );
}

function generatePriceHistory(stock: Stock): PricePoint[] {
  const points: PricePoint[] = [];
  const steps = 60;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const mid = stock.open + (stock.price - stock.open) * t;
    const volatility = (stock.high - stock.low) * 0.18;
    const noise = (Math.sin(i * 1.7) + Math.cos(i * 0.9)) * volatility * (1 - t * 0.4);
    const price = Math.max(stock.low * 0.995, Math.min(stock.high * 1.005, mid + noise));

    const hour = 9 + Math.floor((i / steps) * 7);
    const min = Math.floor(((i / steps) * 7 * 60) % 60);
    points.push({ time: `${hour}:${min.toString().padStart(2, "0")}`, price });
  }
  return points;
}

export default function StockTable({
  symbol,
  onLoaded,
}: {
  symbol: string;
  onLoaded: () => void;
}) {
  const [stock, setStock] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const quote = await fetchQuote(symbol);
        const s: Stock = { symbol, ...quote };
        setStock(s);
        setPriceHistory(generatePriceHistory(s));
      } catch {
        setError("Invalid symbol or data unavailable.");
      } finally {
        setLoading(false);
        onLoaded();
      }
    }
    load();
  }, [symbol]);

  if (loading) {
    return (
      <div className="td-loading">
        <span className="td-blink">▋</span> Fetching {symbol}…
      </div>
    );
  }

  if (error || !stock) {
    return <div className="td-error">✗ {error}</div>;
  }

  const positive = stock.changePercent >= 0;
  const changeColor = positive ? "var(--green)" : "var(--red)";

  return (
    <div className="td-card">
      <div className="td-card-header">
        <div>
          <span className="td-symbol">{stock.symbol}</span>
          <span className="td-label" style={{ marginLeft: "0.75rem" }}>NASDAQ</span>
        </div>
        <div className="td-change" style={{ color: changeColor }}>
          {positive ? "▲" : "▼"} {Math.abs(stock.changePercent).toFixed(2)}%
        </div>
      </div>

      <div className="td-price">${stock.price.toFixed(2)}</div>

      <div className="td-chart">
        <Sparkline data={priceHistory} positive={positive} />
      </div>

      <div className="td-stats">
        {[
          { label: "OPEN", value: stock.open },
          { label: "HIGH", value: stock.high },
          { label: "LOW", value: stock.low },
          { label: "PREV CLOSE", value: stock.prevClose },
        ].map(({ label, value }) => (
          <div key={label} className="td-stat">
            <span className="td-stat-label">{label}</span>
            <span className="td-stat-value">${value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}