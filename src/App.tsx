import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import Index from "./pages/Index";
import Dossiers from "./pages/Dossiers";
import Calendrier from "./pages/Calendrier";
import Documents from "./pages/Documents";
import Messages from "./pages/Messages";
import Taches from "./pages/Taches";
import Reporting from "./pages/Reporting";
import Parametres from "./pages/Parametres";
import Abonnement from "./pages/Abonnement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SubscriptionProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dossiers" element={<Dossiers />} />
            <Route path="/calendrier" element={<Calendrier />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/taches" element={<Taches />} />
            <Route path="/reporting" element={<Reporting />} />
            <Route path="/parametres" element={<Parametres />} />
            <Route path="/abonnement" element={<Abonnement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SubscriptionProvider>
  </QueryClientProvider>
);

export default App;
