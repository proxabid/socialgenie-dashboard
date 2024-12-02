import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateStats } from "@/services/stats";
import { generatePosts } from "@/services/openai";
import { savePost } from "@/services/posts";
import { TagSelector } from "./TagSelector";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

export function PostGenerator() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt first");
      return;
    }

    if (!userId) {
      toast.error("Please sign in to generate posts");
      return;
    }

    setLoading(true);
    try {
      console.log("Starting post generation process");
      console.log("Generating post with prompt:", prompt);
      
      const posts = await generatePosts(prompt);
      console.log("Generated posts response:", posts);
      
      if (!posts || posts.length === 0) {
        throw new Error("No content was generated");
      }

      const response = posts[0];
      setGeneratedContent(response);
      
      console.log("Saving post to Supabase");
      await savePost({ 
        content: response, 
        prompt, 
        timestamp: new Date().toISOString(),
        tags: selectedTags
      });
      
      console.log("Post saved successfully");
      
      const wordCount = response.split(' ').length;
      updateStats(wordCount);
      
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      toast.success("Post generated and saved successfully!");
      setPrompt(""); // Clear the prompt after successful generation
    } catch (error) {
      console.error("Error in post generation process:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatContent = (content: string) => {
    return content
      .split('.')
      .filter(sentence => sentence.trim())
      .map(sentence => sentence.trim() + '.')
      .join('\n\n');
  };

  return (
    <Card className="p-8 space-y-6 bg-white shadow-sm border border-gray-100 rounded-xl">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">Generate New Post</h2>
        <p className="text-sm text-gray-500">Enter your prompt to generate a social media post</p>
      </div>
      
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Enter your post prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full bg-gray-50 border-gray-200 focus:border-blue-500 rounded-lg"
        />
        
        <TagSelector selectedTags={selectedTags} onTagsChange={setSelectedTags} />
        
        <div className="flex gap-3">
          <Button 
            onClick={handleGenerate} 
            disabled={loading || !prompt.trim()}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
          >
            {loading ? "Generating..." : "Generate Post"}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
            disabled={!generatedContent}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>

      {showPreview && generatedContent && (
        <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="font-medium text-gray-700 mb-3">Preview:</h3>
          <div className="text-gray-600 leading-relaxed whitespace-pre-line">
            {formatContent(generatedContent)}
          </div>
        </div>
      )}
    </Card>
  );
}