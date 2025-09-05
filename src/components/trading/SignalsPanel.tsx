import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Minus, Clock, Target, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export type SignalType = "BUY" | "SELL" | "HOLD" | "STRONG_BUY" | "STRONG_SELL";

interface Signal {
  type: SignalType;
  confidence: number;
  strength: number;
  timestamp: Date;
  strategy: string;
  entry: number;
  stopLoss: number;
  target: number;
  riskReward: number;
  duration: string;
}

interface SignalsPanelProps {
  signal: Signal;
  accuracy: number;
  activeAlerts: number;
}

const signalConfig = {
  STRONG_BUY: {
    label: "Strong Buy",
    icon: TrendingUp,
    color: "text-bull",
    bgColor: "bg-bull/10",
    borderColor: "border-bull/30"
  },
  BUY: {
    label: "Buy",
    icon: TrendingUp,
    color: "text-bull",
    bgColor: "bg-bull/5",
    borderColor: "border-bull/20"
  },
  HOLD: {
    label: "Hold",
    icon: Minus,
    color: "text-neutral",
    bgColor: "bg-neutral/10",
    borderColor: "border-neutral/30"
  },
  SELL: {
    label: "Sell",
    icon: TrendingDown,
    color: "text-bear",
    bgColor: "bg-bear/5",
    borderColor: "border-bear/20"
  },
  STRONG_SELL: {
    label: "Strong Sell",
    icon: TrendingDown,
    color: "text-bear",
    bgColor: "bg-bear/10",
    borderColor: "border-bear/30"
  }
};

export function SignalsPanel({ signal, accuracy, activeAlerts }: SignalsPanelProps) {
  const config = signalConfig[signal.type];
  const Icon = config.icon;

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span>Current Signal</span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {signal.timestamp.toLocaleTimeString()}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Signal */}
        <div className={cn(
          "p-4 rounded-lg border-2 relative overflow-hidden",
          config.bgColor,
          config.borderColor
        )}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Icon className={cn("h-6 w-6", config.color)} />
              <div>
                <div className={cn("text-xl font-bold", config.color)}>
                  {config.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {signal.strategy}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold">
                {signal.strength}/5
              </div>
              <div className="text-sm text-muted-foreground">
                Strength
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-background/50">
              {signal.confidence}% Confidence
            </Badge>
            <Badge variant="outline" className="bg-background/30">
              {signal.duration}
            </Badge>
          </div>
        </div>

        {/* Trading Levels */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-secondary/50">
            <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
              <Target className="h-3 w-3" />
              Entry
            </div>
            <div className="font-semibold">
              ₹{signal.entry.toLocaleString('en-IN')}
            </div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-bear/5 border border-bear/20">
            <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" />
              Stop Loss
            </div>
            <div className="font-semibold text-bear">
              ₹{signal.stopLoss.toLocaleString('en-IN')}
            </div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-bull/5 border border-bull/20">
            <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
              <Target className="h-3 w-3" />
              Target
            </div>
            <div className="font-semibold text-bull">
              ₹{signal.target.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Risk Reward */}
        <div className="p-3 rounded-lg bg-muted/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Risk:Reward Ratio</span>
            <span className="font-semibold">1:{signal.riskReward}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div className="text-center">
            <div className="text-2xl font-bold text-bull">
              {accuracy}%
            </div>
            <div className="text-xs text-muted-foreground">
              Today's Accuracy
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {activeAlerts}
            </div>
            <div className="text-xs text-muted-foreground">
              Active Alerts
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className={cn(
            "w-full font-semibold",
            signal.type.includes("BUY") && "bg-gradient-bull hover:bg-bull/90",
            signal.type.includes("SELL") && "bg-gradient-bear hover:bg-bear/90",
            signal.type === "HOLD" && "bg-gradient-primary"
          )}
        >
          Set Alert for This Signal
        </Button>
      </CardContent>
    </Card>
  );
}