import { useState, useEffect, useCallback } from 'react';
import { realTradingDataProvider, MarketData, TechnicalIndicator, TradingSignal } from '@/lib/real-trading-data';
import { tradingDataProvider } from '@/lib/trading-data';
import { realKiteDataProvider } from '@/lib/kite-real-data';

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
    // Try Real Kite data first, then Yahoo Finance, then mock data
    try {
      console.log('Fetching data from Kite NSE (Real Data)...');
      const marketData = await realKiteDataProvider.fetchNiftyData();
      const indicators = realKiteDataProvider.generateTechnicalIndicators();
      const signal = realKiteDataProvider.generateTradingSignal();
      
      console.log('Kite NSE data fetched successfully:', { 
        price: marketData.current, 
        change: marketData.change, 
        signal: signal.type, 
        strategy: signal.strategy,
        indicatorsCount: indicators.length 
      });
      
      setMarketData(marketData);
      setIndicators(indicators);
      setSignal(signal);
      setLastUpdate(new Date());
      setIsConnected(true);
    } catch (kiteError) {
      console.error('Failed to fetch Kite data, trying Yahoo Finance:', kiteError);
      
      // Fallback to Yahoo Finance
      try {
        const marketData = await realTradingDataProvider.fetchNiftyData();
        const indicators = realTradingDataProvider.generateTechnicalIndicators();
        const signal = realTradingDataProvider.generateTradingSignal();
        
        setMarketData(marketData);
        setIndicators(indicators);
        setSignal(signal);
        setLastUpdate(new Date());
        setIsConnected(true);
      } catch (yahooError) {
        console.error('Failed to fetch Yahoo Finance data, falling back to mock data:', yahooError);
        
        // Final fallback to mock data provider
        try {
          console.log('Falling back to mock data...');
          const marketData = tradingDataProvider.generateMarketData();
          const indicators = tradingDataProvider.generateTechnicalIndicators();
          const signal = tradingDataProvider.generateTradingSignal();
          
          console.log('Mock data generated:', { marketData, signal, indicatorsCount: indicators.length });
          
          setMarketData(marketData);
          setIndicators(indicators);
          setSignal(signal);
          setLastUpdate(new Date());
          setIsConnected(false); // Show as disconnected since using mock data
        } catch (fallbackError) {
          console.error('Failed to generate mock data:', fallbackError);
          setIsConnected(false);
        }
      }
    }
  }, []);

  useEffect(() => {
    // Initial load
    refresh();

    // Set up data updates every 30 seconds for real-time trading data
    const interval = setInterval(refresh, 30000);

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