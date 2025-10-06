// /api/log-search.js
import fs from "fs";
import path from "path";

export async function handler(event, context) {
  try {
    const { query, category } = JSON.parse(event.body || "{}");
    const timestamp = new Date().toISOString();

    const logEntry = { query, category, timestamp };

    const filePath = path.join(process.cwd(), "search-logs.json");

    let logs = [];
    if (fs.existsSync(filePath)) {
      logs = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    logs.push(logEntry);
    fs.writeFileSync(filePath, JSON.stringify(logs, null, 2));

    console.log("Logged search:", logEntry);

    return { statusCode: 200, body: JSON.stringify({ status: "logged" }) };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}

