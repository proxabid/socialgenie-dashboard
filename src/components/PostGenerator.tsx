import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PostVariations } from "./PostVariations";
import { generatePosts } from "@/services/openai";

export function PostGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState<string[]>([]);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt) {
      toast({
        title: "Please enter a prompt",
        description: "Enter what kind of post you want to generate",
      });
      return;
    }

    setLoading(true);
    console.log("Generating posts for prompt:", prompt);

    try {
      const posts = await generatePosts(prompt);
      setVariations(posts);
      console.log("Generated variations:", posts);
    } catch (error) {
      console.error("Error in post generation:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate posts. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
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
            onClick={handleGenerate}
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

      <PostVariations variations={variations} isLoading={loading} />
    </div>
  );
}