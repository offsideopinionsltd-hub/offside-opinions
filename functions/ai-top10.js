// netlify/functions/ai-top10.js
const fetch = require("node-fetch");

const imageMap = [
  "images/1.jpg","images/2.jpg","images/3.jpg","images/4.jpg",
  "images/5.jpg","images/6.jpg","images/7.jpg","images/8.jpg",
  "images/9.jpg","images/10.jpg","images/11.jpg","images/12.jpg",
  "images/13.jpg","images/14.jpg","images/15.jpg","images/16.jpg",
  "images/17.jpg","images/18.jpg"
];

const affiliateIds = {
  "GB": "offsideopinio-21",
  "DE": "offsideopin00-21",
  "FR": "offsideopi0d6-21",
  "ES": "offsideopin06-21",
  "IT": "offsideopin01-21"
};

exports.handler = async function(event, context) {
  try {
    const query = event.queryStringParameters?.query || "Top 10 Football Boots";
    const country = event.headers['x-country'] || "GB";
    const affiliateId = affiliateIds[country] || affiliateIds["GB"];

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a football expert creating Top 10 lists for a premium football website."
          },
          {
            role: "user",
            content: `Create a Top 10 list for: ${query}. Return JSON array with 10 objects: title, description, price. 
            Include image from 1-18.jpg in order. For affiliateLink, use Amazon UK ID: ${affiliateId}.`
          }
        ],
        max_tokens: 700
      })
    });

    const data = await response.json();
    let aiResults = [];

    if (data?.choices?.[0]?.message?.content) {
      try {
        aiResults = JSON.parse(data.choices[0].message.content);
      } catch {
        aiResults = [];
      }
    }

    // Fallback if AI fails
    if (!aiResults.length) {
      aiResults = Array.from({ length: 10 }, (_, i) => ({
        title: `Sample Top 10 Item #${i+1}`,
        description: `This is a sample description for item #${i+1}`,
        price: `£${(i+1)*20}`,
        image: imageMap[i % imageMap.length],
        affiliateLink: `https://www.amazon.co.uk/dp/PRODUCTID?tag=${affiliateId}`
      }));
    } else {
      // Ensure images and affiliate links are mapped
      aiResults = aiResults.map((item,index) => ({
        title: item.title || `Item #${index+1}`,
        description: item.description || "",
        price: item.price || "£0",
        image: imageMap[index % imageMap.length],
        affiliateLink: `https://www.amazon.co.uk/dp/PRODUCTID?tag=${affiliateId}`
      }));
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aiResults)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};


