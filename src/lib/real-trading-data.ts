// Real trading data provider using Yahoo Finance API
export interface MarketData {
  current: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  prevClose: number;
  isOpen: boolean;
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: "BUY" | "SELL" | "NEUTRAL";
  strength: number;
  description: string;
  category: "trend" | "momentum" | "volume" | "volatility";
}

export interface TradingSignal {
  type: "BUY" | "SELL" | "HOLD" | "STRONG_BUY" | "STRONG_SELL";
  confidence: number;
  strength: number;
  timestamp: Date;
  strategy: string;
  entry: number;
  stopLoss: number;
  target: number;
  riskReward: number;
  duration: string;
}

interface YahooFinanceResponse {
  chart: {
    result: [{
      meta: {
        regularMarketPrice: number;
        previousClose: number;
        regularMarketDayHigh: number;
        regularMarketDayLow: number;
        regularMarketVolume: number;
        marketState: string;
      };
      timestamp: number[];
      indicators: {
        quote: [{
          open: number[];
          high: number[];
          low: number[];
          close: number[];
          volume: number[];
        }];
      };
    }];
  };
}

// Real data provider
class RealTradingDataProvider {
  private lastPrices: number[] = [];
  private volumes: number[] = [];
  private highs: number[] = [];
  private lows: number[] = [];

  async fetchNiftyData(): Promise<MarketData> {
    try {
      // Using NIFTY 50 ETF (NIFTYBEES.NS) as proxy for NIFTY 50 index
      const symbol = '^NSEI'; // NIFTY 50 index symbol
      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=5m`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: YahooFinanceResponse = await response.json();
      const result = data.chart.result[0];
      const meta = result.meta;
      const quotes = result.indicators.quote[0];

      // Store historical data for technical analysis
      this.lastPrices = quotes.close.filter(price => price !== null);
      this.volumes = quotes.volume.filter(vol => vol !== null);
      this.highs = quotes.high.filter(high => high !== null);
      this.lows = quotes.low.filter(low => low !== null);

      const current = meta.regularMarketPrice;
      const prevClose = meta.previousClose;
      const change = current - prevClose;
      const changePercent = (change / prevClose) * 100;

      // Market is open between 9:15 AM - 3:30 PM IST (Mon-Fri)
      const now = new Date();
      const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)); // Convert to IST
      const hours = istTime.getHours();
      const minutes = istTime.getMinutes();
      const day = istTime.getDay();
      
      const isMarketHours = (day >= 1 && day <= 5) && // Monday to Friday
        ((hours === 9 && minutes >= 15) || (hours > 9 && hours < 15) || (hours === 15 && minutes <= 30));

      return {
        current: Math.round(current * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
        high: meta.regularMarketDayHigh,
        low: meta.regularMarketDayLow,
        volume: meta.regularMarketVolume,
        prevClose: prevClose,
        isOpen: isMarketHours && meta.marketState === 'REGULAR'
      };
    } catch (error) {
      console.error('Failed to fetch NIFTY data:', error);
      // Fallback to last known data or throw
      throw error;
    }
  }

  calculateSMA(period: number): number {
    if (this.lastPrices.length < period) return 0;
    const slice = this.lastPrices.slice(-period);
    return slice.reduce((sum, price) => sum + price, 0) / period;
  }

  calculateRSI(period: number = 14): number {
    if (this.lastPrices.length < period + 1) return 50; // Neutral RSI

    let gains = 0;
    let losses = 0;

    for (let i = this.lastPrices.length - period; i < this.lastPrices.length; i++) {
      const change = this.lastPrices[i] - this.lastPrices[i - 1];
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  calculateMACD(): { macd: number; signal: number; histogram: number } {
    const ema12 = this.calculateEMA(12);
    const ema26 = this.calculateEMA(26);
    const macd = ema12 - ema26;
    const signal = this.calculateEMA(9, [macd]); // Simplified
    const histogram = macd - signal;

    return { macd, signal, histogram };
  }

  calculateEMA(period: number, data?: number[]): number {
    const prices = data || this.lastPrices;
    if (prices.length < period) return prices[prices.length - 1] || 0;

    const multiplier = 2 / (period + 1);
    let ema = prices[0];

    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }

    return ema;
  }

  generateTechnicalIndicators(): TechnicalIndicator[] {
    if (this.lastPrices.length === 0) return [];

    const currentPrice = this.lastPrices[this.lastPrices.length - 1];
    const sma20 = this.calculateSMA(20);
    const sma50 = this.calculateSMA(50);
    const rsi = this.calculateRSI();
    const macd = this.calculateMACD();

    return [
      {
        name: "SMA 20",
        value: Math.round(sma20 * 100) / 100,
        signal: currentPrice > sma20 ? "BUY" : "SELL",
        strength: Math.abs(currentPrice - sma20) > (currentPrice * 0.01) ? 4 : 2,
        description: "20-period Simple Moving Average",
        category: "trend"
      },
      {
        name: "SMA 50",
        value: Math.round(sma50 * 100) / 100,
        signal: currentPrice > sma50 ? "BUY" : "SELL",
        strength: sma20 > sma50 ? 3 : 2,
        description: "50-period Simple Moving Average", 
        category: "trend"
      },
      {
        name: "RSI",
        value: Math.round(rsi * 100) / 100,
        signal: rsi > 70 ? "SELL" : rsi < 30 ? "BUY" : "NEUTRAL",
        strength: rsi > 80 || rsi < 20 ? 5 : rsi > 70 || rsi < 30 ? 4 : 2,
        description: "Relative Strength Index",
        category: "momentum"
      },
      {
        name: "MACD",
        value: Math.round(macd.macd * 100) / 100,
        signal: macd.macd > macd.signal ? "BUY" : "SELL",
        strength: Math.abs(macd.histogram) > 10 ? 4 : 2,
        description: "Moving Average Convergence Divergence",
        category: "trend"
      },
      {
        name: "Volume Trend",
        value: this.volumes.length > 0 ? this.volumes[this.volumes.length - 1] : 0,
        signal: this.volumes.length > 1 && 
                this.volumes[this.volumes.length - 1] > (this.volumes[this.volumes.length - 2] * 1.2) ? "BUY" : "NEUTRAL",
        strength: 3,
        description: "Volume trend analysis",
        category: "volume"
      }
    ];
  }

  generateTradingSignal(): TradingSignal {
    const indicators = this.generateTechnicalIndicators();
    const currentPrice = this.lastPrices[this.lastPrices.length - 1] || 19750;
    
    // Count BUY/SELL signals
    const buySignals = indicators.filter(ind => ind.signal === "BUY").length;
    const sellSignals = indicators.filter(ind => ind.signal === "SELL").length;
    const totalSignals = indicators.length;

    let signalType: TradingSignal["type"];
    let confidence: number;
    let strength: number;

    if (buySignals > sellSignals) {
      signalType = buySignals >= totalSignals * 0.7 ? "STRONG_BUY" : "BUY";
      confidence = Math.round((buySignals / totalSignals) * 100);
      strength = Math.min(5, Math.round((buySignals / totalSignals) * 5));
    } else if (sellSignals > buySignals) {
      signalType = sellSignals >= totalSignals * 0.7 ? "STRONG_SELL" : "SELL";
      confidence = Math.round((sellSignals / totalSignals) * 100);
      strength = Math.min(5, Math.round((sellSignals / totalSignals) * 5));
    } else {
      signalType = "HOLD";
      confidence = 50;
      strength = 2;
    }

    const entry = currentPrice;
    const atr = this.calculateATR();
    const stopLoss = signalType.includes("BUY") ? 
      entry - (atr * 2) : entry + (atr * 2);
    const target = signalType.includes("BUY") ? 
      entry + (atr * 3) : entry - (atr * 3);
    const riskReward = Math.abs(target - entry) / Math.abs(entry - stopLoss);

    return {
      type: signalType,
      confidence: Math.max(60, confidence), // Minimum 60% confidence
      strength,
      timestamp: new Date(),
      strategy: this.getStrategy(indicators),
      entry: Math.round(entry * 100) / 100,
      stopLoss: Math.round(stopLoss * 100) / 100,
      target: Math.round(target * 100) / 100,
      riskReward: Math.round(riskReward * 10) / 10,
      duration: strength >= 4 ? "Swing" : "Intraday"
    };
  }

  private calculateATR(period: number = 14): number {
    if (this.highs.length < period || this.lows.length < period || this.lastPrices.length < period) {
      return this.lastPrices[this.lastPrices.length - 1] * 0.02; // 2% fallback
    }

    let trSum = 0;
    for (let i = 1; i < period && i < this.highs.length; i++) {
      const tr = Math.max(
        this.highs[this.highs.length - i] - this.lows[this.lows.length - i],
        Math.abs(this.highs[this.highs.length - i] - this.lastPrices[this.lastPrices.length - i - 1]),
        Math.abs(this.lows[this.lows.length - i] - this.lastPrices[this.lastPrices.length - i - 1])
      );
      trSum += tr;
    }

    return trSum / Math.min(period - 1, this.highs.length - 1);
  }

  private getStrategy(indicators: TechnicalIndicator[]): string {
    const trendIndicators = indicators.filter(ind => ind.category === "trend");
    const momentumIndicators = indicators.filter(ind => ind.category === "momentum");

    if (trendIndicators.some(ind => ind.signal === "BUY") && momentumIndicators.some(ind => ind.signal === "BUY")) {
      return "Trend + Momentum Confluence";
    } else if (trendIndicators.some(ind => ind.signal === "BUY")) {
      return "Trend Following";
    } else if (momentumIndicators.some(ind => ind.signal === "BUY")) {
      return "Momentum Breakout";
    } else {
      return "Technical Analysis";
    }
  }
}

export const realTradingDataProvider = new RealTradingDataProvider();