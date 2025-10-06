// netlify/functions/ai-top10.js
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
  const country = event.headers['x-country'] || "GB";
  const affiliateId = affiliateIds[country] || affiliateIds["GB"];

  // Create 10 dummy items
  const dummyResults = Array.from({ length: 10 }, (_, i) => ({
    title: `Sample Top 10 Item #${i+1}`,
    description: `This is a sample description for item #${i+1}`,
    price: `£${(i+1)*20}`,
    image: imageMap[i % imageMap.length],
    affiliateLink: `https://www.amazon.co.uk/dp/PRODUCTID?tag=${affiliateId}`
  }));

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dummyResults)
  };
};


