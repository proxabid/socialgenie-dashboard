import { DashboardLayout } from "@/components/DashboardLayout";
import { PostGenerator } from "@/components/PostGenerator";
import { PostFeed } from "@/components/PostFeed";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, LogOut, TrendingUp, Flame, PenTool } from "lucide-react";
import { useState } from "react";
import { getApiKey, setApiKey } from "@/services/openai";
import { toast } from "sonner";
import { SignedIn, SignedOut, RedirectToSignIn, useUser, useClerk } from "@clerk/clerk-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { useStats } from "@/services/stats";

const Index = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKeyState] = useState(getApiKey() || "");
  const { user } = useUser();
  const { signOut } = useClerk();
  const { data: stats, isLoading } = useStats();

  const StatCard = ({ title, value, trend, data, icon: Icon, gradient }) => (
    <Card className={`p-6 ${gradient} text-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300`}>
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
              dataKey="count" 
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
                title="Total Posts Generated" 
                value={stats.totalPosts}
                trend={10}
                data={stats.history.posts.slice(-10)}
                icon={PenTool}
                gradient="bg-gradient-to-r from-violet-500 to-purple-500"
              />
              <StatCard 
                title="Words Written" 
                value={stats.totalWords}
                trend={8}
                data={stats.history.words.slice(-10)}
                icon={TrendingUp}
                gradient="bg-gradient-to-r from-blue-500 to-cyan-500"
              />
              <StatCard 
                title="Current Streak" 
                value={stats.currentStreak}
                trend={stats.currentStreak > 0 ? 100 : 0}
                data={stats.history.posts.slice(-10).map(post => ({ count: stats.currentStreak }))}
                icon={Flame}
                gradient="bg-gradient-to-r from-orange-500 to-red-500"
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
