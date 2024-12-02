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
      <Card className="p-8 space-y-6 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Generate Post</h2>
          <p className="text-sm text-muted-foreground">
            Describe what kind of post you want to generate
          </p>
        </div>
        <Textarea
          placeholder="Enter your prompt here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[150px] resize-none border-gray-200 dark:border-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        <div className="flex justify-end">
          <Button
            onClick={handleGenerate}
            disabled={!prompt || loading}
            className="px-8 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              "Generating..."
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
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