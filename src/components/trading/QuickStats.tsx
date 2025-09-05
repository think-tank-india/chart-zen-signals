import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickStatsProps {
  dayGainLoss: number;
  weekGainLoss: number;
  monthGainLoss: number;
  totalTrades: number;
  winRate: number;
  avgHoldTime: string;
}

export function QuickStats({
  dayGainLoss,
  weekGainLoss,
  monthGainLoss,
  totalTrades,
  winRate,
  avgHoldTime
}: QuickStatsProps) {
  const stats = [
    {
      label: "Today",
      value: dayGainLoss,
      isPercentage: true,
      icon: dayGainLoss >= 0 ? TrendingUp : TrendingDown
    },
    {
      label: "This Week", 
      value: weekGainLoss,
      isPercentage: true,
      icon: weekGainLoss >= 0 ? TrendingUp : TrendingDown
    },
    {
      label: "This Month",
      value: monthGainLoss,
      isPercentage: true,
      icon: monthGainLoss >= 0 ? TrendingUp : TrendingDown
    },
    {
      label: "Total Trades",
      value: totalTrades,
      isPercentage: false,
      icon: Users
    },
    {
      label: "Win Rate",
      value: winRate,
      isPercentage: true,
      icon: TrendingUp
    },
    {
      label: "Avg Hold Time",
      value: avgHoldTime,
      isPercentage: false,
      icon: Clock,
      isString: true
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const isPositive = typeof stat.value === 'number' ? stat.value >= 0 : true;
        const isNeutral = stat.label === "Total Trades" || stat.label === "Avg Hold Time";
        
        return (
          <Card key={index} className="bg-gradient-card border-border/50 shadow-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon className={cn(
                  "h-4 w-4",
                  isNeutral ? "text-muted-foreground" : 
                  isPositive ? "text-bull" : "text-bear"
                )} />
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs px-2 py-0.5",
                    !isNeutral && isPositive && "border-bull/30 text-bull bg-bull/5",
                    !isNeutral && !isPositive && "border-bear/30 text-bear bg-bear/5"
                  )}
                >
                  {stat.label}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className={cn(
                  "text-lg font-bold",
                  isNeutral ? "text-foreground" :
                  isPositive ? "text-bull" : "text-bear"
                )}>
                  {stat.isString ? stat.value : 
                   stat.isPercentage ? 
                     `${isPositive ? '+' : ''}${stat.value}%` : 
                     stat.value.toLocaleString()
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}