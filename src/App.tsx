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
          console.log("Starting session sync for user:", userId);
          
          // Get JWT token from Clerk with specific template
          const token = await getToken({
            skipCache: true,
            template: "supabase",
          });
          
          if (!token) {
            console.error("No token received from Clerk");
            return;
          }

          console.log("Received token from Clerk, setting Supabase session");
          
          // First sign out to clear any existing session
          await supabase.auth.signOut();
          
          // Set the new session with the token
          const { data, error } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: token,
          });
          
          if (error) {
            console.error("Failed to set Supabase session:", error);
            return;
          }
          
          console.log("Successfully set Supabase session:", !!data.session);
          
          // Verify the session
          const { data: { session } } = await supabase.auth.getSession();
          console.log("Verified Supabase session status:", !!session);
          
        } else {
          console.log("No Clerk user ID, signing out from Supabase");
          await supabase.auth.signOut();
        }
      } catch (error) {
        console.error("Session sync error:", error);
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