export interface Post {
  content: string;
  prompt: string;
  timestamp: string;
}

const POSTS_KEY = 'generated-posts';

export function savePost(post: Post) {
  const posts = getPosts();
  posts.unshift(post); // Add new post at the beginning
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export function getPosts(): Post[] {
  const posts = localStorage.getItem(POSTS_KEY);
  return posts ? JSON.parse(posts) : [];
}