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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-4 h-48" />
        ))}
      </div>
    );
  }

  if (!variations.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {variations.map((post, index) => (
        <Card key={index} className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">Variation {index + 1}</p>
          <p className="text-sm">{post}</p>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => copyToClipboard(post)}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
        </Card>
      ))}
    </div>
  );
}