import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

interface Connections {
  twitter: boolean;
  telegram: boolean;
  discord: boolean;
  reddit: boolean;
}

interface NewAgent {
  name: string;
  image: string;
  abilities: string[];
  balance: number;
  attack: number;
  defense: number;
  connections: Connections;
}

export default function CreateAgent() {
  const router = useRouter();
  const [loadingStep, setLoadingStep] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [agentName, setAgentName] = useState("");
  const [selectedAbility, setSelectedAbility] = useState("influencer");
  const dialogRef = useRef<HTMLDivElement>(null);
  const [newAgent, setNewAgent] = useState<NewAgent>({
    name: "",
    image: "/robot-head.png",
    abilities: [""],
    balance: 0,
    attack: 50,
    defense: 50,
    connections: {
      twitter: false,
      telegram: false,
      discord: false,
      reddit: false,
    },
  });

  const loadingSteps = [
    "Creating wallet...",
    "Configuring agent...",
    "Setting up social connections...",
    "Initializing AI parameters...",
    "Finalizing setup...",
  ];

  useEffect(() => {
    if (showDialog) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < loadingSteps.length - 1) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 1500);

      return () => clearInterval(interval);
    }
  }, [showDialog]);

  const handleClickOutside = (event: React.MouseEvent) => {
    if (
      dialogRef.current &&
      !dialogRef.current.contains(event.target as Node)
    ) {
      setShowDialog(false);
      setLoadingStep(0);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAgent({ ...newAgent, [name]: value });
  };

  const handleAbilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAbility(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgentName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDialog(true);
  };

  const handleConnectionChange = (connectionName: keyof Connections) => {
    setNewAgent({
      ...newAgent,
      connections: {
        ...newAgent.connections,
        [connectionName]: !newAgent.connections[connectionName],
      },
    });
  };

  return (
    <Layout>
      <div className="flex p-4 gap-32">
        <div className="w-1/2">
          <div className="flex flex-col gap-4 w-1/2 rpgui-container framed-golden z-0">
            <div className="flex justify-center">
              <img
                src="/robot-head.png"
                className="w-32 h-32 rounded-full"
                alt="robot head"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={agentName}
                onChange={handleNameChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="description">Description</label>
              <textarea id="description" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="abilities">Ability</label>
              <select
                className="rpgui-dropdown p-1"
                value={selectedAbility}
                onChange={handleAbilityChange}
              >
                <option value="influencer">Influencer</option>
                <option value="analyst">Analyst</option>
                <option value="trader">Trader</option>
                <option value="investor">Investor</option>
              </select>
            </div>
            <div className="flex flex-col gap-0 mt-2">
              <label htmlFor="degeneracy">Degeneracy</label>
              <input
                className="rpgui-slider golden"
                type="range"
                min="0"
                max="10"
                value="8"
              />
            </div>
            <div className="flex flex-col gap-0 mt-2">
              <label htmlFor="connection">Connections</label>
              <div className="flex items-center gap-2">
                <input
                  className="rpgui-checkbox"
                  type="checkbox"
                  checked={newAgent.connections.twitter}
                  onChange={() => handleConnectionChange("twitter")}
                />
                <label>Twitter</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  className="rpgui-checkbox"
                  type="checkbox"
                  checked={newAgent.connections.telegram}
                  onChange={() => handleConnectionChange("telegram")}
                />
                <label>Telegram</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  className="rpgui-checkbox"
                  type="checkbox"
                  checked={newAgent.connections.discord}
                  onChange={() => handleConnectionChange("discord")}
                />
                <label>Discord</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  className="rpgui-checkbox"
                  type="checkbox"
                  checked={newAgent.connections.reddit}
                  onChange={() => handleConnectionChange("reddit")}
                />
                <label>Reddit</label>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2 ml-32">
          <div className="flex flex-col gap-4 w-2/5 rpgui-container framed-golden-2 z-0">
            <div className="flex flex-col gap-2">
              <label htmlFor="description">Character File</label>
              <textarea id="description" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="name">OpenAI API Key</label>
              <input type="password" id="name" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Twitter Username</label>
              <input type="password" id="name" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Twitter Password</label>
              <input type="password" id="name" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Twitter Email</label>
              <input type="password" id="name" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Telegram Bot Token</label>
              <input type="password" id="name" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Discord Application ID</label>
              <input type="password" id="name" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Discord API Token</label>
              <input type="password" id="name" />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="name">Reddit API Token</label>
              <input type="password" id="name" />
            </div>
            <div className="flex justify-center">
              <button className="w-1/6 rpgui-button" onClick={handleSubmit}>
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
      {showDialog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={handleClickOutside}
        >
          <div
            ref={dialogRef}
            className="rpgui-container framed-golden-2 p-4 w-[400px] relative"
          >
            <button
              className="absolute top-2 right-2 text-xl"
              onClick={() => {
                setShowDialog(false);
                setLoadingStep(0);
              }}
            >
              ×
            </button>

            <div className="flex items-center gap-4 mb-4">
              <img
                src={newAgent.image}
                alt="Agent"
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h4 className="font-bold">{agentName || "Unnamed Agent"}</h4>
                <p className="capitalize">{selectedAbility}</p>
              </div>
            </div>

            <div className="flex justify-center">
              <p className="text-yellow-400">{loadingSteps[loadingStep]}</p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
