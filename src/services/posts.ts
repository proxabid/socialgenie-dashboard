import { supabase } from "@/integrations/supabase/client";

export interface Post {
  content: string;
  prompt: string;
  timestamp: string;
  tags: string[];
}

export async function savePost(post: Post) {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    console.error("No authenticated session found");
    throw new Error("You must be logged in to save posts");
  }

  console.log("Attempting to save post with user ID:", sessionData.session.user.id);
  console.log("Post data:", post);

  const { data, error } = await supabase.from('posts').insert({
    content: post.content,
    prompt: post.prompt,
    tags: post.tags,
    user_id: sessionData.session.user.id,
    created_at: new Date().toISOString()
  });

  if (error) {
    console.error("Error saving post to Supabase:", error);
    throw new Error("Failed to save post: " + error.message);
  }

  console.log("Post saved successfully:", data);
  return data;
}

export async function getPosts(): Promise<Post[]> {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    console.error("No authenticated session found");
    return [];
  }

  console.log("Fetching posts for user ID:", sessionData.session.user.id);

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', sessionData.session.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts: " + error.message);
  }

  console.log("Retrieved posts:", data);

  return (data || []).map(post => ({
    content: post.content,
    prompt: post.prompt,
    timestamp: post.created_at,
    tags: post.tags || []
  }));
}