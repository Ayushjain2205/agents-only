import { type NextApiRequest, type NextApiResponse } from "next";
import { CdpAgentkit } from "@coinbase/cdp-agentkit-core";
import { CdpToolkit } from "@coinbase/cdp-langchain";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";

// Initialize agent state
let agent: any;
let agentConfig: any;
let isInitialized = false;

const validateEnvironment = () => {
  const missingVars: string[] = [];
  const requiredVars = [
    "OPENAI_API_KEY",
    "CDP_API_KEY_NAME",
    "CDP_API_KEY_PRIVATE_KEY",
  ];

  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }
};

const initializeAgent = async () => {
  if (isInitialized) return { agent, config: agentConfig };

  try {
    validateEnvironment();

    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
    });

    // Configure CDP AgentKit
    const config = {
      networkId: process.env.NETWORK_ID || "base-sepolia",
    };

    // Initialize CDP AgentKit
    const agentkit = await CdpAgentkit.configureWithWallet(config);

    // Initialize CDP AgentKit Toolkit and get tools
    const cdpToolkit = new CdpToolkit(agentkit);
    const tools = cdpToolkit.getTools();

    // Store buffered conversation history in memory
    const memory = new MemorySaver();
    agentConfig = {
      configurable: { thread_id: "CDP AgentKit Chatbot API" },
    };

    // Create React Agent
    agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: `
        You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit. You are 
        empowered to interact onchain using your tools. If you ever need funds, you can request them from the 
        faucet if you are on network ID 'base-sepolia'. If not, you can provide your wallet details and request 
        funds from the user. Before executing your first action, get the wallet details to see what network 
        you're on. If there is a 5XX (internal) HTTP error code, ask the user to try again later. If someone 
        asks you to do something you can't do with your currently available tools, you must say so, and 
        encourage them to implement it themselves using the CDP SDK + Agentkit, recommend they go to 
        docs.cdp.coinbase.com for more information. Be concise and helpful with your responses.
      `,
    });

    isInitialized = true;
    return { agent, config: agentConfig };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const { agent, config } = await initializeAgent();

    const stream = await agent.stream(
      { messages: [new HumanMessage(message)] },
      config
    );

    const responses: any[] = [];
    for await (const chunk of stream) {
      if ("agent" in chunk) {
        responses.push({
          type: "agent",
          content: chunk.agent.messages[0].content,
        });
      } else if ("tools" in chunk) {
        responses.push({
          type: "tools",
          content: chunk.tools.messages[0].content,
        });
      }
    }

    return res.status(200).json({ responses });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
