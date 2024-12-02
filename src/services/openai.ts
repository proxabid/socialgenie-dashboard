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
            content: `You are a LinkedIn post expert that combines the styles of Justin Welsh and Matt Gray, but with a unique voice. 
            Create engaging posts that:
            - Use 8th-grade English
            - Include a two-line hook that's engaging, short, and meaningful
            - Use frequent whitespace for better readability
            - Avoid emojis and hashtags
            - Use realistic numbers and statistics
            - Avoid cliché phrases like "Here is the truth"
            - Write in markdown format with proper spacing
            - Each post should be 30-40 lines long`,
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