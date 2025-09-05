import { LivePriceCard } from "@/components/trading/LivePriceCard";
import { SignalsPanel } from "@/components/trading/SignalsPanel";
import { TechnicalIndicators } from "@/components/trading/TechnicalIndicators";
import { MarketStatus } from "@/components/trading/MarketStatus";
import { QuickStats } from "@/components/trading/QuickStats";
import { useTradingData } from "@/hooks/use-trading-data";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Settings, Bell, BarChart3, Activity, Briefcase, TrendingUp } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { 
    marketData, 
    indicators, 
    signal, 
    isConnected, 
    lastUpdate, 
    accuracy, 
    activeAlerts, 
    refresh 
  } = useTradingData();
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (value: string) => {
    if (value === "portfolio") {
      navigate('/portfolio');
    } else if (value === "dashboard") {
      navigate('/dashboard');
    }
  };

  const handleRefresh = () => {
    refresh();
    toast({
      title: "Data Refreshed",
      description: "Market data and indicators have been updated.",
    });
  };

  if (!marketData || !signal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading trading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-header border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">NIFTY50 Trader Pro</h1>
              </div>
              
              {/* Navigation Tabs */}
              <Tabs 
                value={location.pathname === '/portfolio' ? 'portfolio' : 'dashboard'} 
                onValueChange={handleTabChange}
                className="w-auto"
              >
                <TabsList className="bg-secondary/50">
                  <TabsTrigger value="dashboard" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Market Dashboard
                  </TabsTrigger>
                  <TabsTrigger value="portfolio" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    My Portfolio
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <MarketStatus 
                isOpen={marketData.isOpen} 
                isConnected={isConnected}
                lastUpdate={lastUpdate}
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={!isConnected}
                className="flex items-center gap-2"
              >
                <RefreshCw className={cn(
                  "h-4 w-4",
                  !isConnected && "animate-spin"
                )} />
                Refresh
              </Button>
              
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Alerts
              </Button>
              
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* Quick Stats */}
        <QuickStats 
          dayGainLoss={1.25}
          weekGainLoss={-0.85}
          monthGainLoss={3.45}
          totalTrades={147}
          winRate={72.5}
          avgHoldTime="2.3h"
        />

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Market Data & Signals */}
          <div className="lg:col-span-1 space-y-6">
            <LivePriceCard data={marketData} />
            <SignalsPanel 
              signal={signal} 
              accuracy={accuracy} 
              activeAlerts={activeAlerts} 
            />
          </div>
          
          {/* Right Column - Technical Indicators */}
          <div className="lg:col-span-2">
            <TechnicalIndicators indicators={indicators} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 bg-gradient-card rounded-lg border border-border/50">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex flex-col gap-2 text-center hover:bg-primary/5">
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm font-medium">View Charts</span>
            </Button>
            
            <Button variant="outline" className="h-16 flex flex-col gap-2 text-center hover:bg-primary/5">
              <Bell className="h-5 w-5" />
              <span className="text-sm font-medium">Create Alert</span>
            </Button>
            
            <Button variant="outline" className="h-16 flex flex-col gap-2 text-center hover:bg-primary/5">
              <RefreshCw className="h-5 w-5" />
              <span className="text-sm font-medium">Backtest</span>
            </Button>
            
            <Button variant="outline" className="h-16 flex flex-col gap-2 text-center hover:bg-primary/5">
              <Settings className="h-5 w-5" />
              <span className="text-sm font-medium">Settings</span>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-muted-foreground">
          <p>© 2024 NIFTY50 Trader Pro. Real-time data updates every 5 seconds.</p>
          <p className="mt-1">For educational and analysis purposes only. Not financial advice.</p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;