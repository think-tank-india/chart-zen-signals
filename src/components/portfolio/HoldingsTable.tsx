import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, MoreHorizontal, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { HoldingData } from "@/hooks/use-portfolio-data";
import { useState } from "react";

interface HoldingsTableProps {
  holdings: HoldingData[];
  isLoading: boolean;
}

type SortField = 'tradingsymbol' | 'quantity' | 'average_price' | 'last_price' | 'pnl' | 'day_change_percentage';
type SortDirection = 'asc' | 'desc';

export function HoldingsTable({ holdings, isLoading }: HoldingsTableProps) {
  const [sortField, setSortField] = useState<SortField>('pnl');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedHoldings = [...holdings].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    const numA = Number(aValue);
    const numB = Number(bValue);
    
    return sortDirection === 'asc' ? numA - numB : numB - numA;
  });

  if (isLoading) {
    return (
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading holdings...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort(field)}>
      <div className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-3 w-3" />
        {sortField === field && (
          <div className={cn(
            "w-1 h-1 rounded-full",
            sortDirection === 'asc' ? "bg-bull" : "bg-bear"
          )} />
        )}
      </div>
    </TableHead>
  );

  return (
    <Card className="bg-gradient-card border-border/50 shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Holdings ({holdings.length})</CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-bull rounded-full"></div>
            <span>Gainers</span>
            <div className="w-2 h-2 bg-bear rounded-full"></div>
            <span>Losers</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader field="tradingsymbol">Stock</SortableHeader>
                <SortableHeader field="quantity">Qty</SortableHeader>
                <SortableHeader field="average_price">Avg Price</SortableHeader>
                <SortableHeader field="last_price">LTP</SortableHeader>
                <SortableHeader field="pnl">P&L</SortableHeader>
                <SortableHeader field="day_change_percentage">Day Change</SortableHeader>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {sortedHoldings.map((holding, index) => {
                const isPnLPositive = holding.pnl >= 0;
                const isDayChangePositive = holding.day_change >= 0;
                const pnlPercentage = ((holding.last_price - holding.average_price) / holding.average_price) * 100;
                
                return (
                  <TableRow key={`${holding.tradingsymbol}-${holding.exchange}-${index}`} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{holding.tradingsymbol}</div>
                        <div className="text-xs text-muted-foreground">{holding.exchange}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{holding.quantity}</div>
                        {holding.t1_quantity > 0 && (
                          <div className="text-xs text-muted-foreground">T+1: {holding.t1_quantity}</div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-right">
                        ₹{holding.average_price.toLocaleString('en-IN', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-right">
                        ₹{holding.last_price.toLocaleString('en-IN', { 
                          minimumFractionDigits: 2, 
                          maximumFractionDigits: 2 
                        })}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className={cn(
                        "text-right font-medium",
                        isPnLPositive ? "text-bull" : "text-bear"
                      )}>
                        <div>
                          {isPnLPositive ? '+' : ''}₹{Math.abs(holding.pnl).toLocaleString('en-IN')}
                        </div>
                        <div className="text-xs">
                          ({isPnLPositive ? '+' : ''}{pnlPercentage.toFixed(2)}%)
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className={cn(
                        "text-right font-medium",
                        isDayChangePositive ? "text-bull" : "text-bear"
                      )}>
                        <div className="flex items-center justify-end gap-1">
                          {isDayChangePositive ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {isDayChangePositive ? '+' : ''}{holding.day_change_percentage.toFixed(2)}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {isDayChangePositive ? '+' : ''}₹{holding.day_change.toFixed(2)}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {holdings.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No holdings found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
