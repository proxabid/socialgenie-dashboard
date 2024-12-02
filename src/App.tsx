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
          
          // Check localStorage first
          const storedToken = localStorage.getItem('supabase_token');
          let token = storedToken;

          if (!storedToken) {
            // If no token in localStorage, get new one from Clerk
            token = await getToken({
              template: "supabase",
            });
            
            if (!token) {
              console.error("No token received from Clerk");
              return;
            }

            // Store the new token
            localStorage.setItem('supabase_token', token);
            console.log("New token stored in localStorage");
          }

          console.log("Using token for Supabase session");
          
          // Create a new session with the token
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error("Failed to get Supabase session:", sessionError);
            // Clear stored token if there's an error
            localStorage.removeItem('supabase_token');
            return;
          }

          if (!session) {
            // Only set session if we don't already have one
            const { data, error } = await supabase.auth.setSession({
              access_token: token,
              refresh_token: token,
            });
            
            if (error) {
              console.error("Failed to set Supabase session:", error);
              console.error("Error details:", error.message);
              // Clear stored token if there's an error
              localStorage.removeItem('supabase_token');
              return;
            }
            
            console.log("Successfully set Supabase session:", !!data.session);
          }
          
        } else {
          console.log("No Clerk user ID, signing out from Supabase");
          localStorage.removeItem('supabase_token');
          await supabase.auth.signOut();
        }
      } catch (error) {
        console.error("Session sync error:", error);
        if (error instanceof Error) {
          console.error("Error details:", error.message);
        }
        // Clear stored token on any error
        localStorage.removeItem('supabase_token');
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