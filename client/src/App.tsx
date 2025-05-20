import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/home";
import MyWorlds from "@/pages/my-worlds";
import Explore from "@/pages/explore";
import WorldDetail from "@/pages/world-detail";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/my-worlds" component={MyWorlds} />
      <Route path="/explore" component={Explore} />
      <Route path="/world/:id" component={WorldDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Header />
        <div className="min-h-screen bg-charcoal-dark pt-16">
          <Router />
        </div>
        <Footer />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
