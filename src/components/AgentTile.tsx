import Image from "next/image";

interface AgentTileProps {
  character: {
    id: string;
    name: string;
    image: string;
    abilities: string[];
    power: number;
    rarity: string;
  };
}

export default function AgentTile({ character }: AgentTileProps) {
  const getRarityColor = (rarity: string) => {
    switch (rarity.toLowerCase()) {
      case "legendary":
        return "text-yellow-400";
      case "epic":
        return "text-purple-400";
      case "rare":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="flex flex-col items-center gap-1 rpgui-container framed-golden h-[450px] w-[300px] relative z-0">
      <img
        src="/robot-head.png"
        className="w-24 h-24 rounded-full"
        alt={character.name}
      />
      <h2 className="rpgui-header">{character.name}</h2>
      <p className={`text-sm ${getRarityColor(character.rarity)}`}>
        {character.rarity}
      </p>
      {character.abilities.map((ability, index) => (
        <button
          key={index}
          className="rpgui-button flex items-center justify-center"
          type="button"
        >
          <p className="text-[16px] mb-0">{ability}</p>
        </button>
      ))}

      <div className="flex items-center justify-center gap-12 mt-8">
        <div className="flex items-center justify-center">
          <div className="rpgui-icon sword"></div>
          <p className="text-white">{character.power}</p>
        </div>
        <div className="flex items-center justify-center">
          <div className="rpgui-icon shield"></div>
          <p className="text-white">{Math.floor(character.power * 0.7)}</p>
        </div>
      </div>
    </div>
  );
}
