import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPosts, type Post } from "@/services/posts";
import { getTags } from "@/services/tags";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tag as TagIcon, Monitor, Smartphone, Type, Eye, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

const pastelColors = [
  'bg-[#F2FCE2]/40', // Soft Green with reduced opacity
  'bg-[#FEF7CD]/40', // Soft Yellow with reduced opacity
  'bg-[#FEC6A1]/40', // Soft Orange with reduced opacity
  'bg-[#E5DEFF]/40', // Soft Purple with reduced opacity
  'bg-[#FFDEE2]/40', // Soft Pink with reduced opacity
  'bg-[#FDE1D3]/40', // Soft Peach with reduced opacity
  'bg-[#D3E4FD]/40', // Soft Blue with reduced opacity
  'bg-[#F1F0FB]/40', // Soft Gray with reduced opacity
];

export function PostFeed() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { toast } = useToast();
  const [tags, setTags] = useState(getTags());

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  });

  useEffect(() => {
    setTags(getTags());
  }, []);

  const getTagIcon = (tagName: string) => {
    const lowerName = tagName.toLowerCase();
    if (lowerName.includes('web')) return <Monitor className="w-3 h-3" />;
    if (lowerName.includes('mobile')) return <Smartphone className="w-3 h-3" />;
    if (lowerName.includes('typography')) return <Type className="w-3 h-3" />;
    return <TagIcon className="w-3 h-3" />;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The post content has been copied to your clipboard",
    });
  };

  const getRandomPastelColor = () => {
    return pastelColors[Math.floor(Math.random() * pastelColors.length)];
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <p>Loading posts...</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white/30 shadow-sm border border-gray-100/50 rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="p-8 border-b border-gray-100/50">
        <h2 className="text-xl font-semibold text-gray-900">Generated Posts</h2>
      </div>
      <ScrollArea className="h-[600px]">
        <div className="p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
            {posts.map((post, index) => (
              <Card 
                key={index} 
                className={`relative group overflow-hidden hover:shadow-lg transition-all duration-300 ${getRandomPastelColor()} border border-gray-200/30 hover:border-gray-300/50 rounded-xl`}
              >
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-sm text-gray-600 font-medium line-clamp-1">
                      Prompt: {post.prompt}
                    </p>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="relative min-h-[120px]">
                    <p className="text-gray-700 leading-relaxed line-clamp-3">
                      {post.content}
                    </p>
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/80 to-transparent" />
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {post.tags.slice(0, 2).map((tagId) => {
                        const tag = tags.find(t => t.id === tagId);
                        return tag ? (
                          <Badge 
                            key={tag.id} 
                            variant="secondary"
                            className="bg-white/80 text-gray-700 backdrop-blur-md px-4 py-1.5 text-sm font-medium border border-gray-200/50 shadow-sm hover:bg-white/90 transition-all duration-200"
                          >
                            {getTagIcon(tag.name)}
                            <span className="ml-2">{tag.name}</span>
                          </Badge>
                        ) : null;
                      })}
                      {post.tags.length > 2 && (
                        <Badge 
                          variant="secondary" 
                          className="bg-white/80 text-gray-700 backdrop-blur-md px-4 py-1.5 text-sm font-medium border border-gray-200/50 shadow-sm hover:bg-white/90 transition-all duration-200"
                        >
                          +{post.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white/90 via-white/50 to-transparent">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full bg-white/80 hover:bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-sm"
                    onClick={() => {
                      setSelectedPost(post);
                      setIsPreviewOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          {posts.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              No posts generated yet. Start by generating your first post!
            </div>
          )}
        </div>
      </ScrollArea>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Post Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Prompt</p>
              <p className="text-gray-900">{selectedPost?.prompt}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Content</p>
              <p className="text-gray-900 whitespace-pre-wrap">{selectedPost?.content}</p>
            </div>
            {selectedPost?.tags && selectedPost.tags.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">Tags</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedPost.tags.map((tagId) => {
                    const tag = tags.find(t => t.id === tagId);
                    return tag ? (
                      <Badge 
                        key={tag.id} 
                        variant="secondary"
                        className="bg-gray-50 text-gray-600"
                      >
                        {getTagIcon(tag.name)}
                        <span className="ml-1.5">{tag.name}</span>
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(selectedPost?.content || "")}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Content
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
