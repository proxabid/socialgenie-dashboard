import { DashboardLayout } from "@/components/DashboardLayout";
import { PostGenerator } from "@/components/PostGenerator";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">
          Generate amazing social media posts with AI
        </p>
      </div>
      
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
    </DashboardLayout>
  );
};

export default Index;