import { useQuery } from "@tanstack/react-query";

interface Stats {
  totalPosts: number;
  totalWords: number;
  currentStreak: number;
  history: {
    posts: Array<{ date: string; count: number }>;
    words: Array<{ date: string; count: number }>;
  };
}

// Initialize stats in localStorage if they don't exist
const initializeStats = () => {
  const stats = localStorage.getItem('user-stats');
  if (!stats) {
    const initialStats: Stats = {
      totalPosts: 0,
      totalWords: 0,
      currentStreak: 0,
      history: {
        posts: [],
        words: []
      }
    };
    localStorage.setItem('user-stats', JSON.stringify(initialStats));
    return initialStats;
  }
  return JSON.parse(stats);
};

// Get stats from localStorage
export const getStats = (): Stats => {
  return JSON.parse(localStorage.getItem('user-stats') || '{}');
};

// Update stats when a new post is generated
export const updateStats = (wordCount: number) => {
  const stats = getStats();
  const today = new Date().toISOString().split('T')[0];
  
  // Update total counts
  stats.totalPosts += 1;
  stats.totalWords += wordCount;
  
  // Update history
  stats.history.posts.push({ date: today, count: stats.totalPosts });
  stats.history.words.push({ date: today, count: stats.totalWords });
  
  // Update streak
  const lastPostDate = stats.history.posts.length > 1 
    ? new Date(stats.history.posts[stats.history.posts.length - 2].date)
    : null;
    
  const currentDate = new Date();
  
  if (!lastPostDate) {
    stats.currentStreak = 1;
  } else {
    const diffDays = Math.floor((currentDate.getTime() - lastPostDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 1) {
      stats.currentStreak += 1;
    } else {
      stats.currentStreak = 1;
    }
  }
  
  localStorage.setItem('user-stats', JSON.stringify(stats));
  return stats;
};

// Custom hook to fetch stats
export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => {
      const stats = getStats();
      if (!stats.totalPosts) {
        return initializeStats();
      }
      return stats;
    },
    refetchInterval: 1000 * 60, // Refetch every minute
  });
};