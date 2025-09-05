import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface LivePriceData {
  current: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  prevClose: number;
  isOpen: boolean;
}

interface LivePriceCardProps {
  data: LivePriceData;
  symbol?: string;
}

export function LivePriceCard({ data, symbol = "NIFTY 50" }: LivePriceCardProps) {
  const isPositive = data.change >= 0;
  const isNeutral = data.change === 0;

  return (
    <Card className="relative overflow-hidden bg-gradient-card border-border/50 shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            {symbol}
            <Badge 
              variant={data.isOpen ? "default" : "secondary"}
              className={cn(
                "text-xs",
                data.isOpen && "bg-bull text-white"
              )}
            >
              {data.isOpen ? "LIVE" : "CLOSED"}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            {isPositive ? (
              <TrendingUp className="h-5 w-5 text-bull" />
            ) : isNeutral ? (
              <Activity className="h-5 w-5 text-neutral" />
            ) : (
              <TrendingDown className="h-5 w-5 text-bear" />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Price */}
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">
            ₹{data.current.toLocaleString('en-IN', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </div>
          
          <div className="flex items-center justify-center gap-3">
            <span className={cn(
              "text-lg font-medium flex items-center gap-1",
              isPositive && "text-bull",
              isNeutral && "text-neutral", 
              !isPositive && !isNeutral && "text-bear"
            )}>
              {isPositive ? "+" : ""}{data.change.toFixed(2)}
            </span>
            
            <span className={cn(
              "text-lg font-medium",
              isPositive && "text-bull",
              isNeutral && "text-neutral",
              !isPositive && !isNeutral && "text-bear"
            )}>
              ({isPositive ? "+" : ""}{data.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Day Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">High</span>
              <span className="font-medium text-bull">
                ₹{data.high.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Low</span>
              <span className="font-medium text-bear">
                ₹{data.low.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Prev Close</span>
              <span className="font-medium">
                ₹{data.prevClose.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Volume</span>
              <span className="font-medium">
                {(data.volume / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>
        </div>

        {/* Live indicator */}
        {data.isOpen && (
          <div className="flex items-center justify-center pt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-2 h-2 bg-bull rounded-full animate-pulse-glow" />
              Live updates every 5 seconds
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}