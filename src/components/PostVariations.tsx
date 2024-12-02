import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PostVariationsProps {
  variations: string[];
  isLoading: boolean;
}

export function PostVariations({ variations, isLoading }: PostVariationsProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.write([
      new ClipboardItem({
        "text/plain": new Blob([text], { type: "text/plain" }),
      }),
    ]);
    toast({
      title: "Copied to clipboard",
      description: "The post has been copied to your clipboard",
    });
  };

  const cleanText = (text: string) => {
    return text.replace(/[*#`]/g, '').trim();
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-6 space-y-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="space-y-3">
              <div className="h-3 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
            <div className="h-8 bg-muted rounded w-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (!variations.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {variations.map((post, index) => (
        <Card 
          key={index} 
          className="p-6 space-y-4 animate-fade-in hover:shadow-lg transition-shadow duration-200"
        >
          <p className="text-lg font-semibold text-primary">Variation {index + 1}</p>
          <div className="space-y-4">
            {cleanText(post).split('\n').map((line, i) => (
              line.trim() && (
                <p key={i} className="text-sm leading-relaxed">{line.trim()}</p>
              )
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full hover:scale-105 transition-transform duration-200"
            onClick={() => copyToClipboard(cleanText(post))}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        </Card>
      ))}
    </div>
  );
}