import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateStats } from "@/services/stats";
import { generatePosts } from "@/services/openai";
import { savePost } from "@/services/posts";
import { TagSelector } from "./TagSelector";
import { Card } from "@/components/ui/card";

export function PostGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const posts = await generatePosts(prompt);
      const response = posts[0];
      setGeneratedContent(response);
      
      const wordCount = response.split(' ').length;
      updateStats(wordCount);
      savePost({ 
        content: response, 
        prompt, 
        timestamp: new Date().toISOString(),
        tags: selectedTags
      });
      
      toast.success("Post generated successfully!");
    } catch (error) {
      console.error("Error generating post:", error);
      toast.error("Failed to generate post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-4 bg-white shadow-sm border border-gray-100">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Generate New Post</h2>
        <p className="text-sm text-gray-500">Enter your prompt to generate a social media post</p>
      </div>
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Enter your post prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full bg-gray-50 border-none"
        />
        <TagSelector selectedTags={selectedTags} onTagsChange={setSelectedTags} />
        <Button 
          onClick={handleGenerate} 
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          {loading ? "Generating..." : "Generate Post"}
        </Button>
      </div>
      {generatedContent && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Generated Post:</h3>
          <p className="text-gray-600">{generatedContent}</p>
        </div>
      )}
    </Card>
  );
}