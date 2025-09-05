// Kite MCP Client Integration
// This module provides a clean interface to interact with Kite MCP tools

export interface KiteMCPHolding {
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

export interface KiteMCPProfile {
  user_id: string;
  user_name: string;
  email: string;
  user_type: string;
  broker: string;
  exchanges: string[];
  products: string[];
  order_types: string[];
}

export interface KiteMCPPosition {
  tradingsymbol: string;
  exchange: string;
  instrument_token: number;
  product: string;
  quantity: number;
  overnight_quantity: number;
  multiplier: number;
  average_price: number;
  close_price: number;
  last_price: number;
  value: number;
  pnl: number;
  m2m: number;
  unrealised: number;
  realised: number;
}

export interface KiteMCPMargins {
  equity: {
    enabled: boolean;
    net: number;
    available: {
      adhoc_margin: number;
      cash: number;
      opening_balance: number;
      live_balance: number;
      collateral: number;
      intraday_payin: number;
    };
    utilised: {
      debits: number;
      exposure: number;
      m2m_realised: number;
      m2m_unrealised: number;
      option_premium: number;
      payout: number;
      span: number;
      holding_sales: number;
      turnover: number;
      liquid_collateral: number;
      stock_collateral: number;
    };
  };
  commodity?: any;
}

class KiteMCPClient {
  private isAvailable(): boolean {
    return typeof window !== 'undefined' && 
           typeof (window as any).mcp_kite_get_holdings === 'function';
  }

  private async callMCPTool(toolName: string, params: any = {}): Promise<any> {
    if (!this.isAvailable()) {
      throw new Error('Kite MCP tools not available in this environment');
    }

    const mcpFunction = (window as any)[toolName];
    if (typeof mcpFunction !== 'function') {
      throw new Error(`Kite MCP tool ${toolName} not found`);
    }

    try {
      const response = await mcpFunction(params);
      console.log(`[KiteMCP] ${toolName} response:`, response);
      return response;
    } catch (error) {
      console.error(`[KiteMCP] ${toolName} error:`, error);
      throw error;
    }
  }

  async login(): Promise<{ login_url?: string; message?: string }> {
    return await this.callMCPTool('mcp_kite_login', { random_string: 'portfolio_login' });
  }

  async getProfile(): Promise<KiteMCPProfile> {
    const response = await this.callMCPTool('mcp_kite_get_profile', { random_string: 'get_profile' });
    return response.data;
  }

  async getHoldings(): Promise<KiteMCPHolding[]> {
    const response = await this.callMCPTool('mcp_kite_get_holdings', {});
    
    if (!response || !response.data || !Array.isArray(response.data)) {
      throw new Error('Invalid holdings response format');
    }

    return response.data;
  }

  async getPositions(): Promise<{ net: KiteMCPPosition[]; day: KiteMCPPosition[] }> {
    const response = await this.callMCPTool('mcp_kite_get_positions', {});
    return response.data;
  }

  async getMargins(): Promise<KiteMCPMargins> {
    const response = await this.callMCPTool('mcp_kite_get_margins', { random_string: 'get_margins' });
    return response.data;
  }

  async getLTP(instruments: string[]): Promise<Record<string, { last_price: number; instrument_token: number }>> {
    if (!instruments || instruments.length === 0) {
      throw new Error('No instruments provided for LTP request');
    }

    const response = await this.callMCPTool('mcp_kite_get_ltp', { instruments });
    return response.data;
  }

  async getOHLC(instruments: string[]): Promise<Record<string, { 
    last_price: number; 
    ohlc: { open: number; high: number; low: number; close: number }; 
  }>> {
    if (!instruments || instruments.length === 0) {
      throw new Error('No instruments provided for OHLC request');
    }

    const response = await this.callMCPTool('mcp_kite_get_ohlc', { instruments });
    return response.data;
  }

  async getQuotes(instruments: string[]): Promise<Record<string, any>> {
    if (!instruments || instruments.length === 0) {
      throw new Error('No instruments provided for quotes request');
    }

    const response = await this.callMCPTool('mcp_kite_get_quotes', { instruments });
    return response.data;
  }

  async searchInstruments(query: string, filter_on?: string): Promise<any[]> {
    const response = await this.callMCPTool('mcp_kite_search_instruments', { 
      query,
      filter_on: filter_on || 'id'
    });
    return response.data;
  }

  // Helper method to check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getProfile();
      return true;
    } catch (error) {
      console.log('[KiteMCP] Authentication check failed:', error);
      return false;
    }
  }

  // Helper method to handle authentication flow
  async ensureAuthenticated(): Promise<void> {
    const isAuth = await this.isAuthenticated();
    if (!isAuth) {
      const loginResponse = await this.login();
      if (loginResponse.login_url) {
        throw new Error(`Please complete Kite login: ${loginResponse.login_url}`);
      } else {
        throw new Error('Kite authentication required. Please login to Kite Connect.');
      }
    }
  }
}

// Export singleton instance
export const kiteMCPClient = new KiteMCPClient();

// Export type guards and utilities
export function isKiteMCPError(error: any): boolean {
  return error && 
         typeof error === 'object' && 
         'message' in error &&
         (error.message.includes('login') || 
          error.message.includes('auth') || 
          error.message.includes('session'));
}

export function formatInstrumentKey(exchange: string, tradingsymbol: string): string {
  return `${exchange}:${tradingsymbol}`;
}
