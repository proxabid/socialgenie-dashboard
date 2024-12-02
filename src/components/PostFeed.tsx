import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPosts, type Post } from "@/services/posts";
import { getTags } from "@/services/tags";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tag as TagIcon, Monitor, Smartphone, Type } from "lucide-react";

export function PostFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState(getTags());

  useEffect(() => {
    setPosts(getPosts());
    const handleStorageChange = () => {
      setPosts(getPosts());
      setTags(getTags());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getTagIcon = (tagName: string) => {
    const lowerName = tagName.toLowerCase();
    if (lowerName.includes('web')) return <Monitor className="w-3 h-3" />;
    if (lowerName.includes('mobile')) return <Smartphone className="w-3 h-3" />;
    if (lowerName.includes('typography')) return <Type className="w-3 h-3" />;
    return <TagIcon className="w-3 h-3" />;
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-100 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">Generated Posts</h2>
      </div>
      <ScrollArea className="h-[600px]">
        <div className="p-6 space-y-6">
          {posts.map((post, index) => (
            <Card 
              key={index} 
              className="p-6 hover:bg-gray-50 transition-all duration-200 border border-gray-100 rounded-xl"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-gray-500">
                    Prompt: {post.prompt}
                  </p>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed">{post.content}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {post.tags.map((tagId) => {
                      const tag = tags.find(t => t.id === tagId);
                      return tag ? (
                        <Badge 
                          key={tag.id} 
                          variant="secondary"
                          className="
                            bg-gray-50 text-gray-600 hover:bg-gray-100
                            px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-medium
                            border border-gray-200
                          "
                        >
                          {getTagIcon(tag.name)}
                          {tag.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </Card>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No posts generated yet. Start by generating your first post!
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}