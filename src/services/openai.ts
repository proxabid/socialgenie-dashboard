import { toast } from "sonner";

const API_KEY_STORAGE_KEY = "openai_api_key";

export const getApiKey = () => {
  return localStorage.getItem(API_KEY_STORAGE_KEY);
};

export const setApiKey = (key: string) => {
  localStorage.setItem(API_KEY_STORAGE_KEY, key);
};

export const generatePosts = async (prompt: string): Promise<string[]> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    toast.error("Please set your OpenAI API key in settings");
    return [];
  }

  console.log("Generating posts with prompt:", prompt);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a social media expert that generates engaging posts. Generate unique and creative variations.",
          },
          {
            role: "user",
            content: `Generate 6 unique variations of a social media post for the following prompt: ${prompt}. Each variation should be different in tone and style.`,
          },
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate posts");
    }

    const data = await response.json();
    console.log("Generated posts:", data);

    // Split the response into 6 variations
    const content = data.choices[0].message.content;
    const variations = content
      .split(/\d+\.\s/)
      .filter(Boolean)
      .map((text: string) => text.trim());

    return variations;
  } catch (error) {
    console.error("Error generating posts:", error);
    toast.error("Failed to generate posts. Please try again.");
    return [];
  }
}