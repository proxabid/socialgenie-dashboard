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
          <Card key={i} className="relative overflow-hidden p-6 animate-pulse bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-md w-1/3" />
            <div className="space-y-3 mt-4">
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-md w-3/4" />
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-md w-full" />
              <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-md w-2/3" />
            </div>
            <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-md w-full mt-6" />
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
          className="group relative p-8 space-y-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all duration-300 animate-fade-in rounded-xl"
          style={{
            animationDelay: `${index * 150}ms`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
          
          <div className="relative z-10">
            <p className="text-lg font-semibold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Variation {index + 1}
            </p>
            
            <div className="space-y-4">
              {cleanText(post).split('\n').map((line, i) => (
                line.trim() && (
                  <p 
                    key={i} 
                    className="text-sm leading-relaxed text-gray-600 dark:text-gray-300"
                    style={{
                      animationDelay: `${i * 50}ms`
                    }}
                  >
                    {line.trim()}
                  </p>
                )
              ))}
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full group-hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white"
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