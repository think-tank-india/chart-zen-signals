import { Badge } from "@/components/ui/badge";
import { Clock, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketStatusProps {
  isOpen: boolean;
  isConnected: boolean;
  lastUpdate?: Date;
}

export function MarketStatus({ isOpen, isConnected, lastUpdate }: MarketStatusProps) {
  const getMarketTime = () => {
    const now = new Date();
    const hours = now.getHours();
    
    if (hours >= 9 && hours < 15) {
      return "Market Open";
    } else if (hours >= 15 && hours < 16) {
      return "Market Closing";
    } else {
      return "Market Closed";
    }
  };

  const getNextSession = () => {
    const now = new Date();
    const hours = now.getHours();
    
    if (hours < 9) {
      return "Opens at 9:15 AM";
    } else if (hours >= 15) {
      return "Opens Tomorrow 9:15 AM";
    } else {
      return "Closes at 3:30 PM";
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gradient-header rounded-lg border border-border/50">
      <div className="flex items-center gap-3">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <div>
          <div className="font-medium text-sm">{getMarketTime()}</div>
          <div className="text-xs text-muted-foreground">{getNextSession()}</div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Connection Status */}
        <Badge 
          variant="outline" 
          className={cn(
            "text-xs flex items-center gap-1",
            isConnected ? "border-bull/30 text-bull bg-bull/5" : "border-bear/30 text-bear bg-bear/5"
          )}
        >
          {isConnected ? (
            <Wifi className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3" />
          )}
          {isConnected ? "Connected" : "Disconnected"}
        </Badge>
        
        {/* Market Status */}
        <Badge 
          variant={isOpen ? "default" : "secondary"}
          className={cn(
            "text-xs",
            isOpen && "bg-bull text-white"
          )}
        >
          {isOpen ? "LIVE" : "CLOSED"}
        </Badge>
      </div>
      
      {lastUpdate && (
        <div className="text-xs text-muted-foreground">
          Updated: {lastUpdate.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}