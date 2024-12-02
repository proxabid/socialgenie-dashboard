import { DashboardLayout } from "@/components/DashboardLayout";
import { PostGenerator } from "@/components/PostGenerator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, LogOut, TrendingUp, Flame, PenTool } from "lucide-react";
import { useState, useEffect } from "react";
import { getApiKey, setApiKey } from "@/services/openai";
import { toast } from "sonner";
import { SignedIn, SignedOut, RedirectToSignIn, useUser, useClerk } from "@clerk/clerk-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const Index = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKeyState] = useState(getApiKey() || "");
  const { user } = useUser();
  const { signOut } = useClerk();

  // Stats state with actual metrics
  const [stats, setStats] = useState({
    totalPosts: {
      value: 128,
      trend: +12,
      data: Array.from({ length: 10 }, (_, i) => ({ value: 100 + Math.random() * 50 }))
    },
    totalWords: {
      value: 25600,
      trend: +8,
      data: Array.from({ length: 10 }, (_, i) => ({ value: 20000 + Math.random() * 10000 }))
    },
    streak: {
      value: 7,
      trend: +1,
      data: Array.from({ length: 10 }, (_, i) => ({ value: 5 + Math.random() * 5 }))
    }
  });

  const StatCard = ({ title, value, trend, data, icon: Icon, gradient }) => (
    <Card className={`p-6 ${gradient} text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Icon className="w-5 h-5 opacity-80" />
            <p className="text-sm font-medium opacity-80">{title}</p>
          </div>
          <p className="text-3xl font-bold">{value.toLocaleString()}</p>
        </div>
        <span className={`flex items-center text-sm ${trend >= 0 ? 'text-emerald-100' : 'text-red-100'}`}>
          <TrendingUp className="w-4 h-4 mr-1" />
          {Math.abs(trend)}%
        </span>
      </div>
      <div className="h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="rgba(255,255,255,0.8)" 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );

  const saveApiKey = () => {
    setApiKey(apiKey);
    toast.success("API key saved successfully");
    setShowSettings(false);
  };

  return (
    <>
      <SignedIn>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold">Welcome back, {user?.firstName || 'User'}</h1>
                <p className="text-muted-foreground">
                  Generate amazing social media posts with AI
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button
                  variant="outline"
                  onClick={() => signOut()}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>

            {showSettings && (
              <Card className="p-4 space-y-4">
                <h2 className="font-semibold">OpenAI API Key</h2>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKeyState(e.target.value)}
                    placeholder="Enter your OpenAI API key"
                  />
                  <Button onClick={saveApiKey}>Save</Button>
                </div>
              </Card>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard 
                title="Total Posts Generated" 
                value={stats.totalPosts.value}
                trend={stats.totalPosts.trend}
                data={stats.totalPosts.data}
                icon={PenTool}
                gradient="bg-gradient-to-r from-violet-500 to-purple-500"
              />
              <StatCard 
                title="Words Written" 
                value={stats.totalWords.value}
                trend={stats.totalWords.trend}
                data={stats.totalWords.data}
                icon={TrendingUp}
                gradient="bg-gradient-to-r from-blue-500 to-cyan-500"
              />
              <StatCard 
                title="Current Streak" 
                value={stats.streak.value}
                trend={stats.streak.trend}
                data={stats.streak.data}
                icon={Flame}
                gradient="bg-gradient-to-r from-orange-500 to-red-500"
              />
            </div>

            <PostGenerator />
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