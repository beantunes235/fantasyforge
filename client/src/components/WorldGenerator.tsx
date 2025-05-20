import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { generateWorld, WorldGenerationRequest } from "@/lib/openai";
import { MagicButton } from "@/components/ui/magic-button";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Loader2 } from "lucide-react";
import { World } from "@shared/schema";

interface WorldGeneratorProps {
  onWorldGenerated: (world: World) => void;
}

const WorldGenerator = ({ onWorldGenerated }: WorldGeneratorProps) => {
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  const [worldType, setWorldType] = useState("medieval");
  const [magicSystem, setMagicSystem] = useState("elemental");

  const worldMutation = useMutation({
    mutationFn: generateWorld,
    onSuccess: (data) => {
      onWorldGenerated(data);
    },
    onError: (error) => {
      toast({
        title: "Failed to generate world",
        description: error.message || "Please try again with a different description",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast({
        title: "World description required",
        description: "Please describe your fantasy world to generate it",
        variant: "destructive",
      });
      return;
    }

    const worldRequest: WorldGenerationRequest = {
      description,
      type: worldType,
      magicSystem,
    };

    worldMutation.mutate(worldRequest);
  };

  return (
    <section id="world-generator" className="py-16 bg-gradient-to-b from-charcoal-dark to-purple-primary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-medieval text-3xl md:text-4xl text-gold-mystical mb-4">
            Craft Your Fantasy World
          </h2>
          <p className="font-story text-parchment max-w-2xl mx-auto">
            Describe your vision, and watch as AI transforms your ideas into an immersive fantasy realm.
          </p>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto bg-charcoal-dark/80 rounded-xl overflow-hidden shadow-2xl border border-blue-magical/30"
        >
          <div className="p-6 md:p-8">
            <div className="mb-6">
              <label 
                htmlFor="world-description" 
                className="block font-ui font-medium text-parchment mb-2"
              >
                Describe your world
              </label>
              <textarea 
                id="world-description" 
                className="w-full h-32 p-3 rounded-lg bg-charcoal-dark border border-blue-magical/50 text-parchment font-story focus:outline-none focus:ring-2 focus:ring-gold-mystical"
                placeholder="A magical realm where floating islands drift among luminous clouds, inhabited by beings that can shape-shift between human and animal forms..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={worldMutation.isPending}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block font-ui font-medium text-parchment mb-2">
                  World Type
                </label>
                <select 
                  className="w-full p-3 rounded-lg bg-charcoal-dark border border-blue-magical/50 text-parchment font-ui focus:outline-none focus:ring-2 focus:ring-gold-mystical"
                  value={worldType}
                  onChange={(e) => setWorldType(e.target.value)}
                  disabled={worldMutation.isPending}
                >
                  <option value="medieval">Medieval Fantasy</option>
                  <option value="celestial">Celestial Realm</option>
                  <option value="steampunk">Steampunk World</option>
                  <option value="elemental">Elemental Domain</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="block font-ui font-medium text-parchment mb-2">
                  Magic System
                </label>
                <select 
                  className="w-full p-3 rounded-lg bg-charcoal-dark border border-blue-magical/50 text-parchment font-ui focus:outline-none focus:ring-2 focus:ring-gold-mystical"
                  value={magicSystem}
                  onChange={(e) => setMagicSystem(e.target.value)}
                  disabled={worldMutation.isPending}
                >
                  <option value="elemental">Elemental Powers</option>
                  <option value="arcane">Arcane Arts</option>
                  <option value="divine">Divine Gifts</option>
                  <option value="runic">Runic Magic</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <MagicButton 
                type="submit"
                className="bg-blue-magical hover:bg-blue-magical/90 text-parchment font-ui text-lg px-8 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                disabled={worldMutation.isPending}
              >
                {worldMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" /> Generate World
                  </>
                )}
              </MagicButton>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default WorldGenerator;
