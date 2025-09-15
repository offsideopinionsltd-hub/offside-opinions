// /functions/ai-top10.js
import fetch from "node-fetch";

export async function handler(event) {
  try {
    const { query } = JSON.parse(event.body);

    if (!query) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing query" }) };
    }

    // Call OpenAI API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert football analyst. Always return a structured Top 10 list of football-related items. Include short descriptions."
          },
          {
            role: "user",
            content: `Give me a Top 10 for: ${query}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const openaiData = await openaiResponse.json();

    // Parse AI text into structured list
    const textOutput = openaiData.choices?.[0]?.message?.content || "";
    const lines = textOutput.split("\n").filter(l => l.trim().length > 0);

    const results = lines.slice(0, 10).map((line, i) => {
      // Try to split into title + description
      const [title, ...descParts] = line.replace(/^\d+[\).\s-]*/, "").split(" – ");
      const description = descParts.join(" – ") || "A great football item.";

      // Build Amazon affiliate link (default to UK)
      const encodedTitle = encodeURIComponent(title);
      const affiliateLinks = {
        UK: `https://www.amazon.co.uk/s?k=${encodedTitle}&tag=offsideopinio-21`,
        DE: `https://www.amazon.de/s?k=${encodedTitle}&tag=offsideopin00-21`,
        FR: `https://www.amazon.fr/s?k=${encodedTitle}&tag=offsideopi0d6-21`,
        ES: `https://www.amazon.es/s?k=${encodedTitle}&tag=offsideopin06-21`,
        IT: `https://www.amazon.it/s?k=${encodedTitle}&tag=offsideopin01-21`,
      };

      return {
        title: title.trim(),
        description: description.trim(),
        image: null, // will fallback to your /images set in index.html
        link: affiliateLinks.UK, // default to UK (could auto-detect later)
      };
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ results })
    };

  } catch (err) {
    console.error("AI function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" })
    };
  }
}

