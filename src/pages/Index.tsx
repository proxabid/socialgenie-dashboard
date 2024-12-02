import { DashboardLayout } from "@/components/DashboardLayout";
import { PostGenerator } from "@/components/PostGenerator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings, LogOut, TrendingUp, TrendingDown } from "lucide-react";
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

  // Mock data for demonstration - in a real app, this would come from your backend
  const [stats, setStats] = useState({
    totalRevenue: {
      value: 4562,
      trend: +12,
      data: Array.from({ length: 10 }, (_, i) => ({ value: 4000 + Math.random() * 1000 }))
    },
    totalVisitors: {
      value: 2562,
      trend: +4,
      data: Array.from({ length: 10 }, (_, i) => ({ value: 2000 + Math.random() * 1000 }))
    },
    totalTransactions: {
      value: 2262,
      trend: -0.69,
      data: Array.from({ length: 10 }, (_, i) => ({ value: 2200 + Math.random() * 200 }))
    },
    totalProducts: {
      value: 2100,
      trend: +2,
      data: Array.from({ length: 10 }, (_, i) => ({ value: 2000 + Math.random() * 200 }))
    }
  });

  const StatCard = ({ title, value, trend, data, color = "#10B981" }) => (
    <Card className="p-4 bg-white">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold">${value.toLocaleString()}</p>
        </div>
        <span className={`flex items-center text-sm ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          {Math.abs(trend)}%
        </span>
      </div>
      <div className="h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Total Revenue" 
                value={stats.totalRevenue.value}
                trend={stats.totalRevenue.trend}
                data={stats.totalRevenue.data}
                color="#10B981"
              />
              <StatCard 
                title="Total Visitors" 
                value={stats.totalVisitors.value}
                trend={stats.totalVisitors.trend}
                data={stats.totalVisitors.data}
                color="#3B82F6"
              />
              <StatCard 
                title="Total Transactions" 
                value={stats.totalTransactions.value}
                trend={stats.totalTransactions.trend}
                data={stats.totalTransactions.data}
                color="#EF4444"
              />
              <StatCard 
                title="Total Products" 
                value={stats.totalProducts.value}
                trend={stats.totalProducts.trend}
                data={stats.totalProducts.data}
                color="#8B5CF6"
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