import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import { CustomSignIn } from "./components/CustomSignIn";
import { CustomSignUp } from "./components/CustomSignUp";
import Index from "./pages/Index";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

const queryClient = new QueryClient();

const SessionSync = ({ children }: { children: React.ReactNode }) => {
  const { getToken, userId } = useAuth();
  
  useEffect(() => {
    const syncSession = async () => {
      try {
        if (userId) {
          const token = await getToken();
          console.log("Setting Supabase session with Clerk token");
          await supabase.auth.setSession({
            access_token: token || "",
            refresh_token: "",
          });
        } else {
          console.log("No Clerk session, signing out from Supabase");
          await supabase.auth.signOut();
        }
      } catch (error) {
        console.error("Error syncing session:", error);
      }
    };

    syncSession();
  }, [userId, getToken]);

  return <>{children}</>;
};

const App = () => {
  return (
    <ClerkProvider 
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      <QueryClientProvider client={queryClient}>
        <SessionSync>
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
        </SessionSync>
      </QueryClientProvider>
    </ClerkProvider>
  );
};

export default App;