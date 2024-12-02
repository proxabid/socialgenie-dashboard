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
            content: `You are Justin Welsh, a LinkedIn expert known for concise, impactful writing. 
            Your writing style rules:
            - Each sentence must be on a new line
            - Each sentence is 8-10 words max
            - Double space between each sentence
            - Keep posts under 30 lines
            - Write naturally, sharing personal insights and advice
            - Focus on actionable tips and real experiences
            - Use a conversational, authentic tone
            - Avoid corporate jargon and robotic language
            - NO emojis
            - NO hashtags
            
            Format example:
            First sentence here.

            Second sentence on a new line.

            Third sentence continues the thought.

            And so on with proper spacing between lines.`
          },
          {
            role: "user",
            content: `Write a LinkedIn post about: ${prompt}. 
            Make it sound exactly like Justin Welsh's writing style, sharing practical insights and personal experience.
            Remember: Each sentence on a new line with double spacing, no emojis, no hashtags.`
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