const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function deploymentExplain(context) {
  try {
    // 1. Validate API Key exists
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.length < 10) {
      throw new Error("Missing or invalid OpenAI API Key");
    }

    const prompt = `
      You are a security-aware DevOps assistant.
      Explain why this environment was selected:
      - Trust Score: ${context.trustScore}
      - Network Zone: ${context.network}
      - Isolation Level: ${context.isolation}
      - Risk Level: ${context.risk}
      Explain: 1. Safety, 2. Risk reduction, 3. Next steps. 
      Use simple language. No technical jargon.
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      timeout: 10000, // 10 second timeout
    });

    return {
      explanation: response.choices[0].message.content,
    };
  } catch (error) {
    // LOG the actual error to your terminal so you can see it
    console.error("❌ OpenAI API Error:", error.message);

    // 2. FALLBACK: Return a manual explanation so the 500 error disappears
    return {
      explanation: `Deployment placement to ${context.environment} was selected because your Trust Score is ${context.trustScore}%. This environment provides level ${context.isolation} isolation to ensure security compliance. (AI insights currently in offline mode).`
    };
  }
};