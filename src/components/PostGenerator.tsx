import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function PostGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generatePost = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Post Generated",
        description: "Your social media post has been generated successfully!",
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Generate Post</h2>
        <p className="text-muted-foreground">
          Describe what kind of post you want to generate
        </p>
      </div>
      <Textarea
        placeholder="Enter your prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="min-h-[150px]"
      />
      <div className="flex justify-end">
        <Button
          onClick={generatePost}
          disabled={!prompt || loading}
          className="transition-all duration-200 hover:scale-105"
        >
          {loading ? (
            "Generating..."
          ) : (
            <>
              <Wand2 className="w-4 h-4 mr-2" />
              Generate
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}