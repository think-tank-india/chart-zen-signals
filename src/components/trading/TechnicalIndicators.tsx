import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, BarChart3, Activity, Zap, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface IndicatorData {
  name: string;
  value: number;
  signal: "BUY" | "SELL" | "NEUTRAL";
  strength: number;
  description: string;
  category: "trend" | "momentum" | "volume" | "volatility";
}

interface TechnicalIndicatorsProps {
  indicators: IndicatorData[];
}

const categoryConfig = {
  trend: {
    label: "Trend",
    icon: TrendingUp,
    color: "text-primary"
  },
  momentum: {
    label: "Momentum", 
    icon: Zap,
    color: "text-neutral"
  },
  volume: {
    label: "Volume",
    icon: BarChart3,
    color: "text-bull"
  },
  volatility: {
    label: "Volatility",
    icon: Activity,
    color: "text-bear"
  }
};

const signalColors = {
  BUY: "text-bull",
  SELL: "text-bear", 
  NEUTRAL: "text-muted-foreground"
};

function IndicatorCard({ indicator }: { indicator: IndicatorData }) {
  const strengthPercentage = (indicator.strength / 5) * 100;
  
  return (
    <div className="p-4 rounded-lg bg-secondary/30 border border-border/50 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-sm">{indicator.name}</h4>
          <p className="text-xs text-muted-foreground">{indicator.description}</p>
        </div>
        <Badge 
          variant="outline" 
          className={cn(
            "text-xs font-medium",
            signalColors[indicator.signal],
            indicator.signal === "BUY" && "border-bull/30 bg-bull/5",
            indicator.signal === "SELL" && "border-bear/30 bg-bear/5"
          )}
        >
          {indicator.signal}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Value</span>
          <span className="font-medium">{indicator.value}</span>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Strength</span>
            <span>{indicator.strength}/5</span>
          </div>
          <Progress 
            value={strengthPercentage} 
            className="h-2"
          />
        </div>
      </div>
    </div>
  );
}

function CategoryView({ indicators, category }: { indicators: IndicatorData[], category: keyof typeof categoryConfig }) {
  const categoryIndicators = indicators.filter(ind => ind.category === category);
  const config = categoryConfig[category];
  const Icon = config.icon;
  
  const avgStrength = categoryIndicators.reduce((sum, ind) => sum + ind.strength, 0) / categoryIndicators.length;
  const buySignals = categoryIndicators.filter(ind => ind.signal === "BUY").length;
  const sellSignals = categoryIndicators.filter(ind => ind.signal === "SELL").length;
  
  return (
    <div className="space-y-4">
      {/* Category Summary */}
      <div className="p-4 rounded-lg bg-gradient-card border border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className={cn("h-5 w-5", config.color)} />
            <span className="font-semibold">{config.label} Analysis</span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{avgStrength.toFixed(1)}/5</div>
            <div className="text-xs text-muted-foreground">Avg Strength</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-bull font-semibold">{buySignals}</div>
            <div className="text-muted-foreground text-xs">Buy Signals</div>
          </div>
          <div>
            <div className="text-bear font-semibold">{sellSignals}</div>
            <div className="text-muted-foreground text-xs">Sell Signals</div>
          </div>
          <div>
            <div className="text-muted-foreground font-semibold">
              {categoryIndicators.length - buySignals - sellSignals}
            </div>
            <div className="text-muted-foreground text-xs">Neutral</div>
          </div>
        </div>
      </div>
      
      {/* Indicators Grid */}
      <div className="grid gap-4">
        {categoryIndicators.map((indicator, index) => (
          <IndicatorCard key={index} indicator={indicator} />
        ))}
      </div>
    </div>
  );
}

export function TechnicalIndicators({ indicators }: TechnicalIndicatorsProps) {
  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Technical Analysis
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="trend" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
            {Object.entries(categoryConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="flex items-center gap-1 text-xs"
                >
                  <Icon className="h-3 w-3" />
                  {config.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          {Object.keys(categoryConfig).map((category) => (
            <TabsContent key={category} value={category} className="mt-4">
              <CategoryView 
                indicators={indicators} 
                category={category as keyof typeof categoryConfig} 
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}