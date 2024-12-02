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
            content: "You are a LinkedIn post generator. Create exactly 3 unique variations of posts. Number each variation clearly with '1.', '2.', and '3.' at the start. Each post should be separated by a clear delimiter like '---'. Focus on readability and proper spacing.",
          },
          {
            role: "user",
            content: `Generate 3 unique variations of a LinkedIn post about: ${prompt}`,
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

    const content = data.choices[0].message.content;
    const variations = content
      .split(/\d+\.\s+/)
      .filter(Boolean)
      .map((text: string) => text.split('---')[0].trim());

    console.log("Processed variations:", variations);
    
    if (variations.length === 0) {
      throw new Error("No variations were generated");
    }

    return variations;
  } catch (error) {
    console.error("Error generating posts:", error);
    throw error;
  }
}