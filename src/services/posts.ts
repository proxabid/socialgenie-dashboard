import { supabase } from "@/integrations/supabase/client";

export interface Post {
  content: string;
  prompt: string;
  timestamp: string;
  tags: string[];
}

export async function savePost(post: Post) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { error } = await supabase.from('posts').insert({
    content: post.content,
    prompt: post.prompt,
    tags: post.tags,
    user_id: userData.user.id,
    created_at: new Date().toISOString()
  });

  if (error) throw error;
}

export async function getPosts(): Promise<Post[]> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data.map(post => ({
    content: post.content,
    prompt: post.prompt,
    timestamp: post.created_at,
    tags: post.tags || []
  }));
}