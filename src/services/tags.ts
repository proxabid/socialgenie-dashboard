const TAGS_KEY = 'post-tags';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export function getTags(): Tag[] {
  const tags = localStorage.getItem(TAGS_KEY);
  return tags ? JSON.parse(tags) : [
    { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-500' },
    { id: 'twitter', name: 'Twitter', color: 'bg-sky-400' },
    { id: 'facebook', name: 'Facebook', color: 'bg-indigo-600' },
    { id: 'instagram', name: 'Instagram', color: 'bg-pink-500' },
  ];
}

export function saveTag(tag: Omit<Tag, 'id'>) {
  const tags = getTags();
  const newTag = { ...tag, id: Date.now().toString() };
  tags.push(newTag);
  localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
  return newTag;
}