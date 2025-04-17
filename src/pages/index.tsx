import { useState } from "react";
import Layout from "../components/Layout";
import AgentTile from "../components/AgentTile";
import { useRouter } from "next/router";

interface Character {
  id: string;
  name: string;
  image: string;
  abilities: string[];
  power: number;
  rarity: string;
}

const characters: Character[] = [
  {
    id: "1",
    name: "Dragon Knight",
    image: "/placeholder.svg?height=100&width=100",
    abilities: ["Fire Breath", "Dragon Scale"],
    power: 2500,
    rarity: "Legendary",
  },
  {
    id: "2",
    name: "Forest Guardian",
    image: "/placeholder.svg?height=100&width=100",
    abilities: ["Nature's Call", "Healing Touch"],
    power: 2000,
    rarity: "Epic",
  },
  {
    id: "3",
    name: "Shadow Assassin",
    image: "/placeholder.svg?height=100&width=100",
    abilities: ["Stealth Strike", "Shadow Walk"],
    power: 1800,
    rarity: "Rare",
  },
  {
    id: "4",
    name: "Ice Mage",
    image: "/placeholder.svg?height=100&width=100",
    abilities: ["Frost Nova", "Ice Shield"],
    power: 2200,
    rarity: "Epic",
  },
  {
    id: "5",
    name: "Thunder Warrior",
    image: "/placeholder.svg?height=100&width=100",
    abilities: ["Lightning Strike", "Storm Armor"],
    power: 2100,
    rarity: "Epic",
  },
  {
    id: "6",
    name: "Ancient Golem",
    image: "/placeholder.svg?height=100&width=100",
    abilities: ["Earth Shatter", "Stone Skin"],
    power: 2300,
    rarity: "Legendary",
  },
];

export default function Home() {
  const router = useRouter();

  const handleCharacterClick = (characterId: string) => {
    router.push(`/playground?character=${characterId}`);
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
        {characters.map((character) => (
          <div
            key={character.id}
            onClick={() => handleCharacterClick(character.id)}
            className="cursor-pointer transform hover:scale-105 transition-transform duration-200"
          >
            <AgentTile character={character} />
          </div>
        ))}
      </div>
    </Layout>
  );
}
