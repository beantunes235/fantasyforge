import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Badge } from "./badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";
import { cn } from "@/lib/utils";

interface ApiStatus {
  openai: {
    available: boolean;
    error: string;
  };
  demo: boolean;
  server: string;
}

export function ApiStatusIndicator() {
  const { data: status, isLoading } = useQuery<ApiStatus>({
    queryKey: ["/api/status"],
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return null;
  }

  if (!status) {
    return (
      <Badge variant="outline" className="bg-red-50 text-red-800 hover:bg-red-100">
        <AlertCircle className="w-4 h-4 mr-1" /> Server Offline
      </Badge>
    );
  }

  const isUsingOpenAI = status.openai.available;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              "transition-all duration-300",
              isUsingOpenAI
                ? "bg-green-50 text-green-800 hover:bg-green-100"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100"
            )}
          >
            {isUsingOpenAI ? (
              <>
                <CheckCircle className="w-4 h-4 mr-1" /> OpenAI Active
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 mr-1" /> Demo Mode
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isUsingOpenAI
            ? "Using OpenAI API for world generation"
            : `Using demo mode with mock data: ${status.openai.error}`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}