export interface Post {
  content: string;
  prompt: string;
  timestamp: string;
  tags: string[];
}

const POSTS_KEY = 'generated-posts';

export function savePost(post: Post) {
  const posts = getPosts();
  posts.unshift(post);
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export function getPosts(): Post[] {
  const posts = localStorage.getItem(POSTS_KEY);
  return posts ? JSON.parse(posts) : [];
}