import { PortfolioSummary } from "@/components/portfolio/PortfolioSummary";
import { HoldingsTable } from "@/components/portfolio/HoldingsTable";
import { usePortfolioData } from "@/hooks/use-portfolio-data";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Download, Settings, TrendingUp, AlertTriangle, Briefcase, BarChart3, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { kiteMCPClient } from "@/lib/kite-mcp-client";

const Portfolio = () => {
  const { 
    holdings, 
    summary, 
    isLoading, 
    isConnected, 
    lastUpdate, 
    refresh, 
    error 
  } = usePortfolioData();
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (value: string) => {
    if (value === "dashboard") {
      navigate('/dashboard');
    } else if (value === "portfolio") {
      navigate('/portfolio');
    }
  };

  const handleRefresh = () => {
    refresh();
    toast({
      title: "Portfolio Refreshed",
      description: "Holdings and P&L data have been updated.",
    });
  };

  const handleKiteLogin = async () => {
    try {
      const loginResponse = await kiteMCPClient.login();
      if (loginResponse.login_url) {
        // Open the login URL in a new window
        window.open(loginResponse.login_url, '_blank');
        toast({
          title: "Kite Login Required",
          description: "Please complete the login process and then refresh the portfolio.",
        });
      } else {
        toast({
          title: "Login Initiated",
          description: loginResponse.message || "Please check for login instructions.",
        });
      }
    } catch (error) {
      console.error('Kite login error:', error);
      toast({
        title: "Login Error",
        description: error instanceof Error ? error.message : "Failed to initiate Kite login",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-2xl font-bold">Portfolio Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            {error.includes('authentication') || error.includes('login') ? (
              <Button onClick={handleKiteLogin} variant="outline">
                <LogIn className="h-4 w-4 mr-2" />
                Login to Kite
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && !summary) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your portfolio...</p>
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
              
              {lastUpdate && (
                <div className="text-sm text-muted-foreground">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={cn(
                  "h-4 w-4",
                  isLoading && "animate-spin"
                )} />
                Refresh
              </Button>
              
              {!isConnected && (
                <Button 
                  onClick={handleKiteLogin} 
                  variant="default" 
                  size="sm" 
                  className="flex items-center gap-2 bg-bull hover:bg-bull/90"
                >
                  <LogIn className="h-4 w-4" />
                  Login to Kite
                </Button>
              )}
              
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
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
        {/* Portfolio Summary */}
        {summary && (
          <PortfolioSummary 
            summary={summary} 
            isConnected={isConnected} 
          />
        )}

        {/* Holdings Table */}
        <HoldingsTable 
          holdings={holdings} 
          isLoading={isLoading} 
        />

        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground pt-8">
          <p>Portfolio data powered by Kite Connect API via MCP</p>
          <p className="mt-1">Real-time updates • Auto-refresh every minute</p>
        </footer>
      </main>
    </div>
  );
};

export default Portfolio;
