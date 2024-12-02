export function getApiKey(): string {
  return localStorage.getItem("openai-api-key") || "";
}

export function setApiKey(key: string) {
  localStorage.setItem("openai-api-key", key);
}

export async function generatePosts(prompt: string): Promise<string[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("Please set your OpenAI API key in settings");
  }

  try {
    console.log("Generating posts with prompt:", prompt);
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
            content: `Craft LinkedIn posts in a voice that mixes Justin Welsh and Matt Gray. Create a unique voice that combines both styles perfectly. Write LinkedIn posts between 30-40 lines, using 8th-grade English. Create a two-line hook for each post that's engaging, short, and meaningful. Write the whole content using whitespace frequently for better readability. No emojis or hashtags. Write in markdown format with proper spacing. Don't exaggerate the numbers in the post keep it real numbers. Avoid using words like "Here is the truth" or similar cliché phrases that sound exactly like Justin Welsh. Your job is to make it unique from your side.`,
          },
          {
            role: "user",
            content: `Generate 6 unique variations of a LinkedIn post about: ${prompt}. Number each variation from 1 to 6.`,
          },
        ],
        temperature: 0.9,
        max_tokens: 2500,
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
    throw error;
  }
}