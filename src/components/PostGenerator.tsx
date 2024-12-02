import { useState, useEffect } from "react";
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

export function PostGenerator() {
  const queryClient = useQueryClient();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [previewContent, setPreviewContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (showPreview && generatedContent) {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= generatedContent.length) {
          setPreviewContent(generatedContent.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [showPreview, generatedContent]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const posts = await generatePosts(prompt);
      const response = posts[0];
      setGeneratedContent(response);
      setShowPreview(true);
      
      const wordCount = response.split(' ').length;
      updateStats(wordCount);
      
      await savePost({ 
        content: response, 
        prompt, 
        timestamp: new Date().toISOString(),
        tags: selectedTags
      });
      
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      
      toast.success("Post generated successfully!");
    } catch (error) {
      console.error("Error generating post:", error);
      toast.error("Failed to generate post.");
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
            disabled={loading}
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
            {formatContent(previewContent)}
          </div>
        </div>
      )}
    </Card>
  );
}