import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

interface Agent {
  id: string;
  name: string;
  image: string;
  abilities: string[];
  balance: number;
  attack: number;
  defense: number;
  description: string;
}

interface Message {
  sender: string;
  content: string;
}

const agent1: Agent = {
  id: "1",
  name: "Dragon Knight",
  image: "/robot-head.png",
  abilities: ["Fire Breath", "Dragon Scale"],
  balance: 100,
  attack: 100,
  defense: 100,
  description: "A legendary warrior blessed with the power of ancient dragons.",
};

const agent2: Agent = {
  id: "2",
  name: "Forest Guardian",
  image: "/robot-head.png",
  abilities: ["Nature's Call", "Healing Touch"],
  balance: 100,
  attack: 80,
  defense: 120,
  description: "Protector of the ancient forests, wielding nature's power.",
};

const LoadingDots = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <div className="font-bold text-lg">preparing{dots}</div>;
};

export default function Playground() {
  const router = useRouter();
  const { character: characterId } = router.query;
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentlyTyping, setCurrentlyTyping] = useState<string | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentlyTyping]);

  const handleConversation = async () => {
    if (!messages.length) {
      setMessages([]);
    }
    setIsStarted(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: messages.length
            ? messages[messages.length - 1].content
            : "Let the battle begin!",
          turns: 4,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const messages = chunk.split("\n\n");

        for (const message of messages) {
          if (message.trim()) {
            try {
              const data = JSON.parse(message);
              if (data.error) {
                console.error("Stream error:", data.error);
                continue;
              }

              // Show typing indicator
              setCurrentlyTyping(data.agent);
              await new Promise((resolve) => setTimeout(resolve, 1000));

              // Add message
              setCurrentlyTyping(null);
              setMessages((prev) => [
                ...prev,
                {
                  sender: data.agent,
                  content: data.message,
                },
              ]);

              // Wait for a moment before processing the next message
              await new Promise((resolve) => setTimeout(resolve, 1000));
            } catch (e) {
              console.error("Error parsing message:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsStarted(false);
      setCurrentlyTyping(null);
    }
  };

  return (
    // <Layout>
    <div className="flex h-screen w-full min-h-screen">
      <div className="w-1/4">
        <div className="flex flex-col gap-4 items-center h-full w-1/4 rpgui-container framed overflow-hidden">
          <img
            src="/robot-head.png"
            className="w-48 h-48 rounded-full mt-6"
            alt="Dragon Knight"
          />
          <h2 className="rpgui-header text-white">{agent1.name}</h2>
          <div className="flex gap-4">
            <div className="rpgui-icon sword"></div>
            <div className="rpgui-icon shield"></div>
            <div className="rpgui-icon potion-red"></div>
            <div className="rpgui-icon potion-blue"></div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="rpgui-icon heart"></div>
            <p className="text-[16px] text-white mb-0">Health: 100</p>
          </div>
          <p>{agent1.description}</p>
          <button
            className="rpgui-button flex items-center justify-center"
            type="button"
          >
            <p className="text-[16px] text-white mb-0">
              Power Level: {agent1.attack + agent1.defense}
            </p>
          </button>
          <div className="flex items-center justify-center gap-2">
            <div className="rpgui-icon sword"></div>
            <p className="text-[16px] text-white mb-0">
              Attack: {agent1.attack}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="rpgui-icon shield"></div>
            <p className="text-[16px] text-white mb-0">
              Defense: {agent1.defense}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="rpgui-icon potion-blue"></div>
            <p className="text-[16px] text-white mb-0">Mana: 100</p>
          </div>
          {!isStarted && (
            <div className="items-center justify-center">
              <button
                onClick={handleConversation}
                className="rpgui-button"
                type="button"
              >
                {messages.length ? "Continue Battle" : "Start Battle"}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="w-2/4">
        <div className="h-full w-1/2 rpgui-container framed-golden overflow-y-auto">
          <div className="h-full flex flex-col">
            <div className="flex-1 flex flex-col gap-4 p-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === agent1.name
                      ? "justify-start"
                      : msg.sender === agent2.name
                      ? "justify-end"
                      : "justify-center"
                  }`}
                >
                  <div
                    className={`p-4 rounded shadow-md ${
                      msg.sender === "system"
                        ? "bg-blue-100 w-full mx-8"
                        : "bg-white w-3/4"
                    }`}
                  >
                    <div className="font-bold mb-1">
                      {msg.sender === "system" ? "Battle Log" : msg.sender}
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {currentlyTyping && (
                <div
                  className={`flex ${
                    currentlyTyping === agent1.name
                      ? "justify-start"
                      : currentlyTyping === agent2.name
                      ? "justify-end"
                      : "justify-center"
                  }`}
                >
                  <div
                    className={`p-4 rounded shadow-md ${
                      currentlyTyping === "system"
                        ? "bg-blue-100 w-full mx-8"
                        : "bg-white w-3/4"
                    }`}
                  >
                    <div className="font-bold mb-1">
                      {currentlyTyping === "system"
                        ? "Battle Log"
                        : currentlyTyping}
                    </div>
                    <LoadingDots />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/4">
        <div className="flex flex-col gap-4 items-center h-full w-1/4 rpgui-container framed overflow-hidden">
          <img
            src="/robot-head.png"
            className="w-48 h-48 rounded-full mt-6"
            alt="Forest Guardian"
          />
          <h2 className="rpgui-header text-white">{agent2.name}</h2>
          <div className="flex gap-4">
            <div className="rpgui-icon sword"></div>
            <div className="rpgui-icon shield"></div>
            <div className="rpgui-icon potion-red"></div>
            <div className="rpgui-icon potion-blue"></div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="rpgui-icon heart"></div>
            <p className="text-[16px] text-white mb-0">Health: 100</p>
          </div>
          <p>{agent2.description}</p>
          <button
            className="rpgui-button flex items-center justify-center"
            type="button"
          >
            <p className="text-[16px] text-white mb-0">
              Power Level: {agent2.attack + agent2.defense}
            </p>
          </button>
          <div className="flex items-center justify-center gap-2">
            <div className="rpgui-icon sword"></div>
            <p className="text-[16px] text-white mb-0">
              Attack: {agent2.attack}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="rpgui-icon shield"></div>
            <p className="text-[16px] text-white mb-0">
              Defense: {agent2.defense}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="rpgui-icon potion-blue"></div>
            <p className="text-[16px] text-white mb-0">Mana: 100</p>
          </div>
        </div>
      </div>
    </div>
    // </Layout>
  );
}
