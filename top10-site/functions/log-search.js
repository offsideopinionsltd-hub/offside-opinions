// /functions/log-search.js
import fs from "fs";
import path from "path";

export async function handler(event) {
  try {
    const { query, category } = JSON.parse(event.body);
    const country = event.headers["x-country"] || "GB";
    const timestamp = new Date().toISOString();

    const logEntry = { query, category, country, timestamp };

    // Save logs to a JSON file in /tmp (works on Netlify functions)
    const filePath = path.join("/tmp", "search-logs.json");
    let logs = [];

    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath);
      logs = JSON.parse(raw);
    }

    logs.push(logEntry);
    fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));

    console.log("Logged search:", logEntry);

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "logged", logEntry })
    };

  } catch (err) {
    console.error("Log search error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}

