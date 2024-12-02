import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tag as TagIcon, Plus, X } from "lucide-react";
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
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag.id}
            variant={selectedTags.includes(tag.id) ? "default" : "outline"}
            className={`
              cursor-pointer px-3 py-1 rounded-full transition-all duration-200
              ${selectedTags.includes(tag.id) 
                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
              }
              flex items-center gap-1 group
            `}
            onClick={() => toggleTag(tag.id)}
          >
            <TagIcon className="w-3 h-3" />
            {tag.name}
            <X className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Badge>
        ))}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-full px-3 py-1 h-auto text-xs font-normal hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Plus className="w-3 h-3 mr-1" />
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
                className="bg-gray-50 border-none"
              />
              <Button onClick={handleCreateTag}>Create Tag</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}