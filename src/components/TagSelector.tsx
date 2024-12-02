import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tag as TagIcon, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getTags, saveTag, type Tag } from "@/services/tags";

interface TagSelectorProps {
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

export function TagSelector({ selectedTags, onTagsChange }: TagSelectorProps) {
  const [tags, setTags] = useState<Tag[]>(getTags);
  const [newTagName, setNewTagName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleTag = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter(id => id !== tagId)
      : [...selectedTags, tagId];
    onTagsChange(newTags);
  };

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      const tag = saveTag({
        name: newTagName.trim(),
        color: `bg-${['blue', 'green', 'red', 'purple', 'pink'][Math.floor(Math.random() * 5)]}-500`
      });
      setTags(getTags());
      setNewTagName("");
      setDialogOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant={selectedTags.includes(tag.id) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleTag(tag.id)}
          >
            <TagIcon className="w-3 h-3 mr-1" />
            {tag.name}
          </Badge>
        ))}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              New Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Tag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
              />
              <Button onClick={handleCreateTag}>Create Tag</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}