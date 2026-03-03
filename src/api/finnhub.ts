const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

const BASE_URL = "https://finnhub.io/api/v1";

type Quote = {
  price: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
};

export async function fetchQuote(symbol: string): Promise<Quote> {
    const res = await fetch(
        `${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`
    );

    if (!res.ok) {
        throw new Error("Failed to fetch stock data");
    }

    const data = await res.json();

    if (!data || data.c === 0) {
        throw new Error("Invalid stock symbol");
    }

    return {
        price: data.c,        // current price
        changePercent: data.dp,
        open: data.o,
        high: data.h,
        low: data.l,
        prevClose: data.pc,
    };
}
