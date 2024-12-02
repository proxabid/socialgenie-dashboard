import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateStats } from "@/services/stats";

export function PostGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Assume there's a function to generate the content
      const response = await generatePost(prompt);
      setGeneratedContent(response);
      
      // After successful generation, update stats
      const wordCount = response.split(' ').length;
      updateStats(wordCount);
      
      toast.success("Post generated successfully!");
    } catch (error) {
      toast.error("Failed to generate post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Enter your post prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Post"}
      </Button>
      {generatedContent && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h2 className="font-bold">Generated Post:</h2>
          <p>{generatedContent}</p>
        </div>
      )}
    </div>
  );
}
