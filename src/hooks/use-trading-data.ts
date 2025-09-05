import { useState, useEffect, useCallback } from 'react';
import { tradingDataProvider, MarketData, TechnicalIndicator, TradingSignal } from '@/lib/trading-data';

interface UseTradingDataReturn {
  marketData: MarketData | null;
  indicators: TechnicalIndicator[];
  signal: TradingSignal | null;
  isConnected: boolean;
  lastUpdate: Date | null;
  accuracy: number;
  activeAlerts: number;
  refresh: () => void;
}

export function useTradingData(): UseTradingDataReturn {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [indicators, setIndicators] = useState<TechnicalIndicator[]>([]);
  const [signal, setSignal] = useState<TradingSignal | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [accuracy] = useState(Math.floor(Math.random() * 15) + 80); // Mock accuracy 80-95%
  const [activeAlerts] = useState(Math.floor(Math.random() * 8) + 2); // Mock active alerts 2-10

  const refresh = useCallback(() => {
    try {
      setMarketData(tradingDataProvider.generateMarketData());
      setIndicators(tradingDataProvider.generateTechnicalIndicators());
      setSignal(tradingDataProvider.generateTradingSignal());
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

    // Set up real-time updates (every 5 seconds for demo)
    const interval = setInterval(refresh, 5000);

    // Simulate occasional connection issues
    const connectionInterval = setInterval(() => {
      if (Math.random() < 0.05) { // 5% chance of temporary disconnection
        setIsConnected(false);
        setTimeout(() => {
          setIsConnected(true);
          refresh();
        }, 2000);
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(connectionInterval);
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