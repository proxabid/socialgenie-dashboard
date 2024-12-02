import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPosts, type Post } from "@/services/posts";
import { getTags } from "@/services/tags";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tag as TagIcon } from "lucide-react";

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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Generated Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {posts.map((post, index) => (
              <Card key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Prompt: {post.prompt}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm">{post.content}</p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {post.tags.map((tagId) => {
                        const tag = tags.find(t => t.id === tagId);
                        return tag ? (
                          <Badge key={tag.id} variant="secondary">
                            <TagIcon className="w-3 h-3 mr-1" />
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
              <div className="text-center text-muted-foreground py-8">
                No posts generated yet. Start by generating your first post!
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}