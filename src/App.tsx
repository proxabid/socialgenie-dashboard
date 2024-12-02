import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { CustomSignIn } from "./components/CustomSignIn";
import { CustomSignUp } from "./components/CustomSignUp";
import Index from "./pages/Index";
import { supabase } from "@/integrations/supabase/client";

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

const queryClient = new QueryClient();

const App = () => {
  const handleClerkSession = async (session: any) => {
    if (session) {
      const { token } = session;
      await supabase.auth.setSession({
        access_token: token,
        refresh_token: '',
      });
    } else {
      await supabase.auth.signOut();
    }
  };

  return (
    <ClerkProvider 
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/sign-in/*" element={<CustomSignIn />} />
              <Route path="/sign-up/*" element={<CustomSignUp />} />
              <Route
                path="/*"
                element={
                  <>
                    <SignedIn>
                      <Routes>
                        <Route path="/" element={<Index />} />
                      </Routes>
                    </SignedIn>
                    <SignedOut>
                      <Navigate to="/sign-in" replace />
                    </SignedOut>
                  </>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default App;