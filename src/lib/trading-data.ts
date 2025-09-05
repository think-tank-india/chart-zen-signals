// Mock trading data provider
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

// Mock data generator
class TradingDataProvider {
  private basePrice = 19750; // NIFTY 50 base price
  private lastPrice = this.basePrice;
  private isMarketOpen = true;
  
  generateMarketData(): MarketData {
    // Simulate price movement
    const volatility = 0.002; // 0.2% max change per update
    const change = (Math.random() - 0.5) * 2 * volatility * this.basePrice;
    this.lastPrice = Math.max(this.lastPrice + change, this.basePrice * 0.95);
    
    const priceChange = this.lastPrice - this.basePrice;
    const changePercent = (priceChange / this.basePrice) * 100;
    
    return {
      current: this.lastPrice,
      change: priceChange,
      changePercent: changePercent,
      high: this.basePrice + (Math.random() * 200 + 100),
      low: this.basePrice - (Math.random() * 150 + 50),
      volume: Math.floor(Math.random() * 50000000 + 100000000),
      prevClose: this.basePrice,
      isOpen: this.isMarketOpen
    };
  }
  
  generateTechnicalIndicators(): TechnicalIndicator[] {
    return [
      // Trend Indicators
      {
        name: "SMA 20",
        value: 19680,
        signal: Math.random() > 0.5 ? "BUY" : "SELL",
        strength: Math.floor(Math.random() * 5) + 1,
        description: "20-period Simple Moving Average",
        category: "trend"
      },
      {
        name: "SMA 50", 
        value: 19620,
        signal: Math.random() > 0.4 ? "BUY" : "NEUTRAL",
        strength: Math.floor(Math.random() * 5) + 1,
        description: "50-period Simple Moving Average",
        category: "trend"
      },
      {
        name: "MACD",
        value: 12.5,
        signal: Math.random() > 0.6 ? "BUY" : "SELL",
        strength: Math.floor(Math.random() * 5) + 1,
        description: "Moving Average Convergence Divergence",
        category: "trend"
      },
      {
        name: "ADX",
        value: 28.7,
        signal: "BUY",
        strength: 4,
        description: "Average Directional Index",
        category: "trend"
      },
      
      // Momentum Indicators
      {
        name: "RSI",
        value: Math.floor(Math.random() * 40) + 30,
        signal: Math.random() > 0.5 ? "BUY" : "SELL",
        strength: Math.floor(Math.random() * 5) + 1,
        description: "Relative Strength Index",
        category: "momentum"
      },
      {
        name: "Stochastic",
        value: Math.floor(Math.random() * 60) + 20,
        signal: Math.random() > 0.4 ? "BUY" : "NEUTRAL",
        strength: Math.floor(Math.random() * 5) + 1,
        description: "Stochastic Oscillator",
        category: "momentum"
      },
      {
        name: "Williams %R",
        value: Math.floor(Math.random() * -40) - 20,
        signal: Math.random() > 0.5 ? "SELL" : "NEUTRAL",
        strength: Math.floor(Math.random() * 5) + 1,
        description: "Williams Percent Range",
        category: "momentum"
      },
      
      // Volume Indicators
      {
        name: "OBV",
        value: 450000000,
        signal: "BUY",
        strength: 3,
        description: "On Balance Volume",
        category: "volume"
      },
      {
        name: "VWAP",
        value: 19725,
        signal: Math.random() > 0.5 ? "BUY" : "SELL",
        strength: Math.floor(Math.random() * 5) + 1,
        description: "Volume Weighted Average Price",
        category: "volume"
      },
      
      // Volatility Indicators
      {
        name: "Bollinger Upper",
        value: 19850,
        signal: "SELL",
        strength: 2,
        description: "Bollinger Bands Upper",
        category: "volatility"
      },
      {
        name: "ATR",
        value: 180.5,
        signal: "NEUTRAL",
        strength: 3,
        description: "Average True Range",
        category: "volatility"
      }
    ];
  }
  
  generateTradingSignal(): TradingSignal {
    const signals: TradingSignal["type"][] = ["STRONG_BUY", "BUY", "HOLD", "SELL", "STRONG_SELL"];
    const strategies = [
      "Moving Average Crossover",
      "RSI Divergence",
      "Bollinger Band Squeeze",
      "MACD Bullish Crossover",
      "Support/Resistance Breakout"
    ];
    
    const signalType = signals[Math.floor(Math.random() * signals.length)];
    const entry = this.lastPrice;
    const stopLoss = entry * (signalType.includes("BUY") ? 0.98 : 1.02);
    const target = entry * (signalType.includes("BUY") ? 1.04 : 0.96);
    const riskReward = Math.abs(target - entry) / Math.abs(entry - stopLoss);
    
    return {
      type: signalType,
      confidence: Math.floor(Math.random() * 30) + 70,
      strength: Math.floor(Math.random() * 3) + 3,
      timestamp: new Date(),
      strategy: strategies[Math.floor(Math.random() * strategies.length)],
      entry: entry,
      stopLoss: stopLoss,
      target: target,
      riskReward: Math.round(riskReward * 10) / 10,
      duration: Math.random() > 0.5 ? "Intraday" : "Swing"
    };
  }
}

export const tradingDataProvider = new TradingDataProvider();