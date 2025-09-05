import { useState, useEffect, useCallback } from 'react';
import { realTradingDataProvider, MarketData, TechnicalIndicator, TradingSignal } from '@/lib/real-trading-data';

interface UseTradingDataReturn {
  marketData: MarketData | null;
  indicators: TechnicalIndicator[];
  signal: TradingSignal | null;
  isConnected: boolean;
  lastUpdate: Date | null;
  accuracy: number;
  activeAlerts: number;
  refresh: () => Promise<void>;
}

export function useTradingData(): UseTradingDataReturn {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [indicators, setIndicators] = useState<TechnicalIndicator[]>([]);
  const [signal, setSignal] = useState<TradingSignal | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [accuracy] = useState(Math.floor(Math.random() * 15) + 80); // Mock accuracy 80-95%
  const [activeAlerts] = useState(Math.floor(Math.random() * 8) + 2); // Mock active alerts 2-10

  const refresh = useCallback(async () => {
    try {
      const marketData = await realTradingDataProvider.fetchNiftyData();
      const indicators = realTradingDataProvider.generateTechnicalIndicators();
      const signal = realTradingDataProvider.generateTradingSignal();
      
      setMarketData(marketData);
      setIndicators(indicators);
      setSignal(signal);
      setLastUpdate(new Date());
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to fetch trading data:', error);
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    // Initial load
    refresh();

    // Set up data updates every 5 minutes (300,000 ms)
    const interval = setInterval(refresh, 300000);

    return () => {
      clearInterval(interval);
    };
  }, [refresh]);

  return {
    marketData,
    indicators,
    signal,
    isConnected,
    lastUpdate,
    accuracy,
    activeAlerts,
    refresh
  };
}