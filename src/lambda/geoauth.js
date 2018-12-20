// show object spread works, i.e. babel works
import fetch from "node-fetch";

const registeredPostcodes = new Set(["TW2 7QR", "W1F 8WX"]);

export async function handler(event, context) {
  const { latitude, longitude } = event.queryStringParameters;
  try {
    const response = await fetch(
      `https://api.postcodes.io/postcodes?lon=${longitude}&lat=${latitude}`
    );
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText };
    }
    const json = await response.json();
    const postcodes = new Set(json.result.map(x => x.postcode));
    const intersection = new Set(
      [...registeredPostcodes].filter(x => postcodes.has(x))
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ permitted: intersection.size > 0 })
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: e.message })
    };
  }
}
