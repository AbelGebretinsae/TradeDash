# TradeDash

A stock dashboard built with React and TypeScript for looking up stock quotes and tracking a personal watchlist. Featured among the selected projects in [MyPortfolio](https://github.com/AbelGebretinsae/MyPortfolio).

**Live app:** [tradedash-app.vercel.app](https://tradedash-app.vercel.app/)

**Repository:** [AbelGebretinsae/TradeDash](https://github.com/AbelGebretinsae/TradeDash)

## Features

- Search by ticker symbol or select a stock from the watchlist.
- Fetch current quotes from Finnhub, including price, percentage change, open, high, low, and previous close.
- Add and remove watchlist symbols, prevent duplicates, and save the watchlist across visits with localStorage.
- Display loading and error states in a responsive dashboard with color-coded price changes and SVG sparklines.

Quotes are fetched when a symbol is selected; they do not stream continuously. Sparkline points are generated from quote values for illustration and are not historical market data.

## Built With

React, TypeScript, Vite, Tailwind CSS, custom CSS, Finnhub API, and browser localStorage.

## Run Locally

Requires Node.js 22.12+ and npm, plus a [Finnhub API key](https://finnhub.io/).

```bash
git clone https://github.com/AbelGebretinsae/TradeDash.git
cd TradeDash
npm install
```

Create a `.env.local` file in the project root:

```dotenv
VITE_FINNHUB_API_KEY=your_finnhub_api_key
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite, then search for a ticker such as `AAPL`. Restart the server after changing environment variables. Vite exposes `VITE_` variables to the browser, so this key is included in the client app.

## Other Commands

```bash
npm run build    # Type-check and create a production build
npm run preview  # Preview the production build locally
npm run lint     # Run ESLint
```
