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
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a social media expert that generates engaging posts. For each prompt, generate exactly 6 unique variations, numbered from 1 to 6. Each variation should be different in tone and style. Make sure to number each variation clearly.",
          },
          {
            role: "user",
            content: `Generate 6 unique variations of a social media post for the following prompt: ${prompt}. Number each variation from 1 to 6.`,
          },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(errorData.error?.message || "Failed to generate posts");
    }

    const data = await response.json();
    console.log("OpenAI API response:", data);

    // Split the response into 6 variations
    const content = data.choices[0].message.content;
    const variations = content
      .split(/\d+\.\s+/)
      .filter(Boolean)
      .map((text: string) => text.trim());

    if (variations.length === 0) {
      throw new Error("No variations were generated");
    }

    console.log("Generated variations:", variations);
    return variations;
  } catch (error) {
    console.error("Error generating posts:", error);
    toast.error(error instanceof Error ? error.message : "Failed to generate posts. Please try again.");
    return [];
  }
}