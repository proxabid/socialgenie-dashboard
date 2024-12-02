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
    throw new Error("No authenticated session found");
  }

  console.log("Saving post with user ID:", sessionData.session.user.id);

  const { error } = await supabase.from('posts').insert({
    content: post.content,
    prompt: post.prompt,
    tags: post.tags,
    user_id: sessionData.session.user.id,
    created_at: new Date().toISOString()
  });

  if (error) {
    console.error("Error saving post:", error);
    throw error;
  }
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
    throw error;
  }

  console.log("Retrieved posts:", data);

  if (!data) {
    console.log("No posts found");
    return [];
  }

  return data.map(post => ({
    content: post.content,
    prompt: post.prompt,
    timestamp: post.created_at,
    tags: post.tags || []
  }));
}