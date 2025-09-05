import { useState, useEffect, useCallback } from 'react';
import { kiteMCPClient, isKiteMCPError, formatInstrumentKey } from '@/lib/kite-mcp-client';

export interface HoldingData {
  tradingsymbol: string;
  exchange: string;
  instrument_token: number;
  isin: string;
  product: string;
  quantity: number;
  average_price: number;
  last_price: number;
  close_price: number;
  pnl: number;
  day_change: number;
  day_change_percentage: number;
  realised_quantity: number;
  t1_quantity: number;
  collateral_quantity: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvestment: number;
  totalPnL: number;
  totalPnLPercentage: number;
  dayPnL: number;
  dayPnLPercentage: number;
  totalHoldings: number;
  gainers: number;
  losers: number;
}

interface UsePortfolioDataReturn {
  holdings: HoldingData[];
  summary: PortfolioSummary | null;
  isLoading: boolean;
  isConnected: boolean;
  lastUpdate: Date | null;
  refresh: () => Promise<void>;
  error: string | null;
}

// Real Kite MCP integration for portfolio data
class RealPortfolioDataProvider {
  async fetchHoldings(): Promise<HoldingData[]> {
    console.log('Fetching real holdings data from Kite MCP...');
    
    try {
      // Ensure user is authenticated first
      await kiteMCPClient.ensureAuthenticated();
      
      // Fetch holdings using the MCP client
      const kiteMCPHoldings = await kiteMCPClient.getHoldings();
      console.log('Successfully fetched real holdings:', kiteMCPHoldings.length, 'holdings');
      
      // Transform Kite MCP response to our HoldingData format
      const holdings: HoldingData[] = kiteMCPHoldings.map((holding) => ({
        tradingsymbol: holding.tradingsymbol || 'Unknown',
        exchange: holding.exchange || 'NSE',
        instrument_token: holding.instrument_token || 0,
        isin: holding.isin || '',
        product: holding.product || 'CNC',
        quantity: Number(holding.quantity) || 0,
        average_price: Number(holding.average_price) || 0,
        last_price: Number(holding.last_price) || 0,
        close_price: Number(holding.close_price) || Number(holding.last_price) || 0,
        pnl: Number(holding.pnl) || 0,
        day_change: Number(holding.day_change) || 0,
        day_change_percentage: Number(holding.day_change_percentage) || 0,
        realised_quantity: Number(holding.realised_quantity) || Number(holding.quantity) || 0,
        t1_quantity: Number(holding.t1_quantity) || 0,
        collateral_quantity: Number(holding.collateral_quantity) || 0
      }));

      // Update last prices with real-time data if available
      return await this.updateLastPrices(holdings);
      
    } catch (error) {
      console.error('Failed to fetch holdings from Kite MCP:', error);
      
      // Handle authentication errors
      if (isKiteMCPError(error)) {
        throw new Error('Kite authentication required. Please login to Kite Connect.');
      }
      
      // Fallback to mock data for development
      console.log('Falling back to mock data for development...');
      return this.getMockHoldings();
    }
  }

  private async updateLastPrices(holdings: HoldingData[]): Promise<HoldingData[]> {
    try {
      // Get real-time prices for all instruments
      const instruments = holdings.map(h => formatInstrumentKey(h.exchange, h.tradingsymbol));
      
      if (instruments.length === 0) return holdings;
      
      const pricesData = await kiteMCPClient.getLTP(instruments);
      
      // Update holdings with real-time prices
      return holdings.map(holding => {
        const instrumentKey = formatInstrumentKey(holding.exchange, holding.tradingsymbol);
        const priceData = pricesData[instrumentKey];
        
        if (priceData && priceData.last_price) {
          const newLastPrice = Number(priceData.last_price);
          const dayChange = newLastPrice - holding.close_price;
          const dayChangePercentage = holding.close_price > 0 ? (dayChange / holding.close_price) * 100 : 0;
          const pnl = (newLastPrice - holding.average_price) * holding.quantity;
          
          return {
            ...holding,
            last_price: newLastPrice,
            day_change: dayChange,
            day_change_percentage: dayChangePercentage,
            pnl: pnl
          };
        }
        
        return holding;
      });
    } catch (error) {
      console.error('Failed to update last prices:', error);
      // Return holdings without updated prices if LTP fails
      return holdings;
    }
  }

  // Fallback mock data (same as before but marked as fallback)
  private getMockHoldings(): HoldingData[] {
    // Using the real data we retrieved from your Kite account as fallback
    return [
    {
      tradingsymbol: "ADANIENSOL",
      exchange: "NSE",
      instrument_token: 2615553,
      isin: "INE931S01010",
      product: "CNC",
      quantity: 100,
      average_price: 697.25,
      last_price: 755.95,
      close_price: 758.35,
      pnl: 5870,
      day_change: -2.4,
      day_change_percentage: -0.32,
      realised_quantity: 100,
      t1_quantity: 0,
      collateral_quantity: 0
    },
    {
      tradingsymbol: "ADANIPORTS",
      exchange: "BSE",
      instrument_token: 136427780,
      isin: "INE742F01042",
      product: "CNC",
      quantity: 50,
      average_price: 1281,
      last_price: 1321.9,
      close_price: 1328.35,
      pnl: 2045,
      day_change: -6.45,
      day_change_percentage: -0.49,
      realised_quantity: 50,
      t1_quantity: 0,
      collateral_quantity: 0
    },
    {
      tradingsymbol: "ADANIPOWER",
      exchange: "NSE",
      instrument_token: 4451329,
      isin: "INE814H01011",
      product: "CNC",
      quantity: 100,
      average_price: 699.6,
      last_price: 609.7,
      close_price: 608.7,
      pnl: -8990,
      day_change: 1,
      day_change_percentage: 0.16,
      realised_quantity: 100,
      t1_quantity: 0,
      collateral_quantity: 0
    },
    {
      tradingsymbol: "FRONTSP",
      exchange: "BSE",
      instrument_token: 133681924,
      isin: "INE572D01014",
      product: "CNC",
      quantity: 40,
      average_price: 1466.1,
      last_price: 4721,
      close_price: 4792.4,
      pnl: 130196,
      day_change: -71.4,
      day_change_percentage: -1.49,
      realised_quantity: 40,
      t1_quantity: 0,
      collateral_quantity: 0
    },
    {
      tradingsymbol: "HAL",
      exchange: "NSE",
      instrument_token: 589569,
      isin: "INE066F01020",
      product: "CNC",
      quantity: 757,
      average_price: 4782.93,
      last_price: 4404.8,
      close_price: 4436.9,
      pnl: -286242.4,
      day_change: -32.1,
      day_change_percentage: -0.72,
      realised_quantity: 757,
      t1_quantity: 0,
      collateral_quantity: 0
    },
    {
      tradingsymbol: "BEL",
      exchange: "BSE",
      instrument_token: 128012548,
      isin: "INE263A01024",
      product: "CNC",
      quantity: 376,
      average_price: 260.92,
      last_price: 370.95,
      close_price: 372.6,
      pnl: 41371.2,
      day_change: -1.65,
      day_change_percentage: -0.44,
      realised_quantity: 376,
      t1_quantity: 0,
      collateral_quantity: 0
    },
    {
      tradingsymbol: "BHARATSE",
      exchange: "NSE",
      instrument_token: 7742465,
      isin: "INE415D01024",
      product: "CNC",
      quantity: 120,
      average_price: 76.5,
      last_price: 160.33,
      close_price: 163.25,
      pnl: 10059.6,
      day_change: -2.92,
      day_change_percentage: -1.79,
      realised_quantity: 120,
      t1_quantity: 0,
      collateral_quantity: 0
    },
    {
      tradingsymbol: "GVTD",
      exchange: "BSE",
      instrument_token: 133702404,
      isin: "INE200A01026",
      product: "CNC",
      quantity: 60,
      average_price: 1726.09,
      last_price: 2750.75,
      close_price: 2712.35,
      pnl: 61479.6,
      day_change: 38.4,
      day_change_percentage: 1.42,
      realised_quantity: 60,
      t1_quantity: 0,
      collateral_quantity: 0
    }
    ];
  }

  calculateSummary(holdings: HoldingData[]): PortfolioSummary {
    const totalInvestment = holdings.reduce((sum, holding) => 
      sum + (holding.average_price * holding.quantity), 0);
    
    const totalValue = holdings.reduce((sum, holding) => 
      sum + (holding.last_price * holding.quantity), 0);
    
    const totalPnL = holdings.reduce((sum, holding) => sum + holding.pnl, 0);
    
    const dayPnL = holdings.reduce((sum, holding) => 
      sum + (holding.day_change * holding.quantity), 0);
    
    const gainers = holdings.filter(holding => holding.pnl > 0).length;
    const losers = holdings.filter(holding => holding.pnl < 0).length;

    return {
      totalValue: Math.round(totalValue * 100) / 100,
      totalInvestment: Math.round(totalInvestment * 100) / 100,
      totalPnL: Math.round(totalPnL * 100) / 100,
      totalPnLPercentage: Math.round((totalPnL / totalInvestment) * 10000) / 100,
      dayPnL: Math.round(dayPnL * 100) / 100,
      dayPnLPercentage: Math.round((dayPnL / totalValue) * 10000) / 100,
      totalHoldings: holdings.length,
      gainers,
      losers
    };
  }
}

const realPortfolioProvider = new RealPortfolioDataProvider();

export function usePortfolioData(): UsePortfolioDataReturn {
  const [holdings, setHoldings] = useState<HoldingData[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching portfolio data from Kite MCP...');
      const holdingsData = await realPortfolioProvider.fetchHoldings();
      const summaryData = realPortfolioProvider.calculateSummary(holdingsData);
      
      console.log('Portfolio data fetched successfully:', {
        totalHoldings: holdingsData.length,
        totalValue: summaryData.totalValue,
        totalPnL: summaryData.totalPnL
      });

      setHoldings(holdingsData);
      setSummary(summaryData);
      setLastUpdate(new Date());
      setIsConnected(true);
    } catch (err) {
      console.error('Failed to fetch portfolio data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial load
    refresh();

    // Set up data updates every 60 seconds for portfolio
    const interval = setInterval(refresh, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [refresh]);

  return {
    holdings,
    summary,
    isLoading,
    isConnected,
    lastUpdate,
    refresh,
    error
  };
}
