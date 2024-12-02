import { DashboardLayout } from "@/components/DashboardLayout";
import { PostGenerator } from "@/components/PostGenerator";
import { PostFeed } from "@/components/PostFeed";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, LogOut, TrendingUp, Flame, PenTool, Calendar, Target } from "lucide-react";
import { useState } from "react";
import { getApiKey, setApiKey } from "@/services/openai";
import { toast } from "sonner";
import { SignedIn, SignedOut, RedirectToSignIn, useUser, useClerk } from "@clerk/clerk-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useStats } from "@/services/stats";
import { cn } from "@/lib/utils";

const Index = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKeyState] = useState(getApiKey() || "");
  const { user } = useUser();
  const { signOut } = useClerk();
  const { data: stats, isLoading } = useStats();

  const StatCard = ({ title, value, subtitle, icon: Icon, gradient, trend, data }) => (
    <Card className="p-6 bg-white shadow-sm border border-gray-100 rounded-2xl hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-xl",
            gradient === "green" && "bg-emerald-50",
            gradient === "purple" && "bg-violet-50",
            gradient === "blue" && "bg-blue-50"
          )}>
            <Icon className={cn(
              "w-5 h-5",
              gradient === "green" && "text-emerald-500",
              gradient === "purple" && "text-violet-500",
              gradient === "blue" && "text-blue-500"
            )} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</span>
              <span className="text-sm text-gray-500">{subtitle}</span>
            </div>
          </div>
        </div>
        {trend && (
          <span className={cn(
            "flex items-center text-sm px-2 py-1 rounded-full",
            trend >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
          )}>
            <TrendingUp className="w-3 h-3 mr-1" />
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {[...Array(7)].map((_, i) => {
          const isActive = i < (value % 7);
          return (
            <div
              key={i}
              className={cn(
                "h-2 rounded-full",
                isActive ? (
                  gradient === "green" ? "bg-emerald-500" :
                  gradient === "purple" ? "bg-violet-500" :
                  "bg-blue-500"
                ) : "bg-gray-100"
              )}
            />
          );
        })}
      </div>
    </Card>
  );

  const saveApiKey = () => {
    setApiKey(apiKey);
    toast.success("API key saved successfully");
    setShowSettings(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <SignedIn>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold text-gray-900">Welcome back, {user?.firstName || 'User'}</h1>
                <p className="text-sm text-gray-500">
                  Generate amazing social media posts with AI
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-gray-600 hover:bg-gray-50"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant="outline"
                  onClick={() => signOut()}
                  className="text-gray-600 hover:bg-gray-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>

            {showSettings && (
              <Card className="p-6 bg-white shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-4">OpenAI API Key</h2>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKeyState(e.target.value)}
                    placeholder="Enter your OpenAI API key"
                    className="bg-gray-50 border-none"
                  />
                  <Button onClick={saveApiKey}>Save</Button>
                </div>
              </Card>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard 
                title="Posts Generated" 
                value={stats.totalPosts}
                subtitle="total posts"
                trend={10}
                data={stats.history.posts.slice(-10)}
                icon={PenTool}
                gradient="purple"
              />
              <StatCard 
                title="Weekly Goal" 
                value={stats.totalWords}
                subtitle="/ 5,000 words"
                data={stats.history.words.slice(-10)}
                icon={Target}
                gradient="blue"
              />
              <StatCard 
                title="Current Streak" 
                value={stats.currentStreak}
                subtitle="days"
                data={stats.history.posts.slice(-10)}
                icon={Flame}
                gradient="green"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <PostGenerator />
              </div>
              <div>
                <PostFeed />
              </div>
            </div>
          </div>
        </DashboardLayout>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default Index;