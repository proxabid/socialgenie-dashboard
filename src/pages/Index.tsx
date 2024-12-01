import { DashboardLayout } from "@/components/DashboardLayout";
import { PostGenerator } from "@/components/PostGenerator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import { useState } from "react";
import { getApiKey, setApiKey } from "@/services/openai";
import { toast } from "sonner";

const Index = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKeyState] = useState(getApiKey() || "");

  const saveApiKey = () => {
    setApiKey(apiKey);
    toast.success("API key saved successfully");
    setShowSettings(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">
              Generate amazing social media posts with AI
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
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
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="p-4 bg-accent/50">
            <h3 className="font-medium mb-2">Today's Posts</h3>
            <p className="text-3xl font-bold">12</p>
          </Card>
          <Card className="p-4 bg-accent/50">
            <h3 className="font-medium mb-2">Total Posts</h3>
            <p className="text-3xl font-bold">128</p>
          </Card>
          <Card className="p-4 bg-accent/50">
            <h3 className="font-medium mb-2">Average Length</h3>
            <p className="text-3xl font-bold">240</p>
          </Card>
        </div>

        <PostGenerator />
      </div>
    </DashboardLayout>
  );
};

export default Index;