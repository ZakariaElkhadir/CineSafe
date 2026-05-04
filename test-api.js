const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: "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",
  baseURL: "https://integrate.api.nvidia.com/v1",
});

async function main() {
  try {
    const completion = await openai.chat.completions.create({
      model: "meta/llama-3.3-70b-instruct",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 10
    });
    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
main();
