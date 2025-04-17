import type { NextApiRequest, NextApiResponse } from "next";

async function getChatbotResponse(message: string) {
  try {
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const host = process.env.VERCEL_URL || "localhost:3001";
    const url = `${protocol}://${host}/api/chatbot`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();
    return data.responses?.[0]?.content || "";
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    return "";
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const { text, turns = 4 } = req.body;
    let currentMessage = text;
    const agents = ["Dragon Knight", "Forest Guardian"];

    // Agent conversation
    for (let i = 0; i < turns; i++) {
      const currentAgent = agents[i % agents.length];
      const response = await getChatbotResponse(currentMessage);
      currentMessage = response;

      res.write(
        JSON.stringify({
          agent: currentAgent,
          message: response,
          turn: i + 1,
          totalTurns: turns,
        }) + "\n\n"
      );
    }

    // Final chatbot response
    const chatbotResponse = await getChatbotResponse(currentMessage);
    res.write(
      JSON.stringify({
        agent: "chatbot",
        message: chatbotResponse,
        turn: turns + 1,
        totalTurns: turns + 1,
      }) + "\n\n"
    );

    res.end();
  } catch (error) {
    console.error("Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    res.write(JSON.stringify({ error: errorMessage }) + "\n\n");
    res.end();
  }
}
