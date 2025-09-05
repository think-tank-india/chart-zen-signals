import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, PieChart, Target, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { PortfolioSummary as PortfolioSummaryType } from "@/hooks/use-portfolio-data";

interface PortfolioSummaryProps {
  summary: PortfolioSummaryType;
  isConnected: boolean;
}

export function PortfolioSummary({ summary, isConnected }: PortfolioSummaryProps) {
  const isPnLPositive = summary.totalPnL >= 0;
  const isDayPnLPositive = summary.dayPnL >= 0;

  const summaryCards = [
    {
      title: "Portfolio Value",
      value: `₹${summary.totalValue.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: "text-primary"
    },
    {
      title: "Total Investment",
      value: `₹${summary.totalInvestment.toLocaleString('en-IN')}`,
      icon: Target,
      color: "text-muted-foreground"
    },
    {
      title: "Total P&L",
      value: `₹${summary.totalPnL.toLocaleString('en-IN')}`,
      subValue: `${isPnLPositive ? '+' : ''}${summary.totalPnLPercentage.toFixed(2)}%`,
      icon: isPnLPositive ? TrendingUp : TrendingDown,
      color: isPnLPositive ? "text-bull" : "text-bear"
    },
    {
      title: "Today's P&L",
      value: `₹${summary.dayPnL.toLocaleString('en-IN')}`,
      subValue: `${isDayPnLPositive ? '+' : ''}${summary.dayPnLPercentage.toFixed(2)}%`,
      icon: isDayPnLPositive ? TrendingUp : TrendingDown,
      color: isDayPnLPositive ? "text-bull" : "text-bear"
    },
    {
      title: "Total Holdings",
      value: summary.totalHoldings.toString(),
      icon: PieChart,
      color: "text-primary"
    },
    {
      title: "Performance",
      value: `${summary.gainers}/${summary.losers}`,
      subValue: "Gainers/Losers",
      icon: Activity,
      color: summary.gainers > summary.losers ? "text-bull" : "text-bear"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Portfolio Overview</h2>
          <p className="text-muted-foreground">Real-time portfolio performance from Kite</p>
        </div>
        <Badge 
          variant={isConnected ? "default" : "secondary"}
          className={cn(
            "text-xs",
            isConnected && "bg-bull text-white"
          )}
        >
          {isConnected ? "CONNECTED" : "DISCONNECTED"}
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          
          return (
            <Card key={index} className="bg-gradient-card border-border/50 shadow-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <Icon className={cn("h-4 w-4", card.color)} />
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-1">
                  <div className={cn("text-2xl font-bold", card.color)}>
                    {card.value}
                  </div>
                  {card.subValue && (
                    <div className={cn("text-sm font-medium", card.color)}>
                      {card.subValue}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Portfolio Health
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-bull">
                {((summary.gainers / summary.totalHoldings) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Winning Positions
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-bear">
                {((summary.losers / summary.totalHoldings) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Losing Positions
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-primary">
                {(summary.totalValue / summary.totalInvestment).toFixed(2)}x
              </div>
              <div className="text-xs text-muted-foreground">
                Portfolio Multiple
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-2xl font-bold text-neutral">
                ₹{(summary.totalValue / summary.totalHoldings).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs text-muted-foreground">
                Avg Position Size
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
