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
          <Card key={i} className="relative overflow-hidden p-6 space-y-4 animate-pulse bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="space-y-3">
              <div className="h-3 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
            <div className="h-8 bg-muted rounded w-full" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skeleton-shine" />
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
          className="group relative p-8 space-y-6 overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300 animate-fade-in border border-gray-200 dark:border-gray-700"
          style={{
            animationDelay: `${index * 150}ms`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Variation {index + 1}
          </p>
          
          <div className="space-y-4 relative z-10">
            {cleanText(post).split('\n').map((line, i) => (
              line.trim() && (
                <p 
                  key={i} 
                  className="text-base leading-relaxed text-gray-700 dark:text-gray-300"
                  style={{
                    animationDelay: `${i * 50}ms`
                  }}
                >
                  {line.trim()}
                </p>
              )
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full group-hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white"
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