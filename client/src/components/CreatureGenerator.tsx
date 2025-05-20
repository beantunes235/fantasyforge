import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { generateCreature, CreatureGenerationRequest, saveCreature } from "@/lib/openai";
import { MagicButton } from "@/components/ui/magic-button";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Crown, Loader2, Plus } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { Creature, World } from "@shared/schema";

interface CreatureGeneratorProps {
  world?: World | null;
}

const CreatureGenerator = ({ world }: CreatureGeneratorProps) => {
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  const [creatureType, setCreatureType] = useState("humanoid");
  const [powerLevel, setPowerLevel] = useState(5);
  const [intelligence, setIntelligence] = useState(5);
  const [generatedCreature, setGeneratedCreature] = useState<Creature | null>(null);

  const creatureMutation = useMutation({
    mutationFn: generateCreature,
    onSuccess: (data) => {
      setGeneratedCreature(data);
    },
    onError: (error) => {
      toast({
        title: "Failed to generate creature",
        description: error.message || "Please try again with a different description",
        variant: "destructive",
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: () => saveCreature(generatedCreature?.id || 0, world?.id || 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/creatures'] });
      toast({
        title: "Creature saved",
        description: `${generatedCreature?.name} has been added to your world`,
      });
    },
    onError: () => {
      toast({
        title: "Failed to save creature",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast({
        title: "Creature description required",
        description: "Please describe your creature to generate it",
        variant: "destructive",
      });
      return;
    }

    const creatureRequest: CreatureGenerationRequest = {
      description,
      type: creatureType,
      powerLevel,
      intelligence,
      worldId: world?.id
    };

    creatureMutation.mutate(creatureRequest);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-charcoal-dark to-purple-primary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-medieval text-3xl md:text-4xl text-gold-mystical mb-4">
            Populate Your World
          </h2>
          <p className="font-story text-parchment max-w-2xl mx-auto">
            Create unique creatures and characters to inhabit your fantasy realm.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-charcoal-dark/80 rounded-xl p-6 border border-blue-magical/30 shadow-xl">
            <h3 className="font-medieval text-2xl text-blue-magical mb-4">Design a Creature</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-ui font-medium text-parchment mb-2">Creature Type</label>
                <select 
                  className="w-full p-3 rounded-lg bg-charcoal-dark border border-blue-magical/50 text-parchment font-ui focus:outline-none focus:ring-2 focus:ring-gold-mystical"
                  value={creatureType}
                  onChange={(e) => setCreatureType(e.target.value)}
                  disabled={creatureMutation.isPending}
                >
                  <option value="humanoid">Humanoid</option>
                  <option value="beast">Beast</option>
                  <option value="mythical">Mythical</option>
                  <option value="elemental">Elemental</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              
              <div>
                <label className="block font-ui font-medium text-parchment mb-2">Description</label>
                <textarea 
                  className="w-full h-24 p-3 rounded-lg bg-charcoal-dark border border-blue-magical/50 text-parchment font-story focus:outline-none focus:ring-2 focus:ring-gold-mystical"
                  placeholder="Describe your creature's appearance, abilities, and nature..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={creatureMutation.isPending}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-ui font-medium text-parchment mb-2">
                    Power Level: {powerLevel}
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={powerLevel}
                    onChange={(e) => setPowerLevel(parseInt(e.target.value))}
                    className="w-full"
                    disabled={creatureMutation.isPending}
                  />
                </div>
                <div>
                  <label className="block font-ui font-medium text-parchment mb-2">
                    Intelligence: {intelligence}
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={intelligence}
                    onChange={(e) => setIntelligence(parseInt(e.target.value))}
                    className="w-full"
                    disabled={creatureMutation.isPending}
                  />
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <MagicButton 
                  type="submit"
                  className="bg-blue-magical hover:bg-blue-magical/90 text-parchment font-ui px-6 py-2 rounded-lg transition-all transform hover:scale-105"
                  disabled={creatureMutation.isPending}
                >
                  {creatureMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Crown className="w-5 h-5 mr-2" /> Generate Creature
                    </>
                  )}
                </MagicButton>
              </div>
            </form>
          </div>
          
          {generatedCreature ? (
            <div className="bg-charcoal-dark/80 rounded-xl p-6 border border-blue-magical/30 shadow-xl">
              <h3 className="font-medieval text-2xl text-blue-magical mb-4">
                {generatedCreature.name}
              </h3>
              
              <div className="rounded-lg overflow-hidden mb-4 h-48">
                <img 
                  src={generatedCreature.imageUrl} 
                  alt={generatedCreature.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-3 font-story text-parchment">
                <p>{generatedCreature.description}</p>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <span className="w-20 font-ui font-medium">Power:</span>
                    <div className="h-2 bg-blue-magical/30 rounded-full flex-grow">
                      <div 
                        className="h-2 bg-blue-magical rounded-full" 
                        style={{ width: `${generatedCreature.powerLevel * 10}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="w-20 font-ui font-medium">Speed:</span>
                    <div className="h-2 bg-blue-magical/30 rounded-full flex-grow">
                      <div 
                        className="h-2 bg-blue-magical rounded-full" 
                        style={{ width: `${generatedCreature.speed * 10}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="w-20 font-ui font-medium">Intelligence:</span>
                    <div className="h-2 bg-blue-magical/30 rounded-full flex-grow">
                      <div 
                        className="h-2 bg-blue-magical rounded-full" 
                        style={{ width: `${generatedCreature.intelligence * 10}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="w-20 font-ui font-medium">Magic:</span>
                    <div className="h-2 bg-blue-magical/30 rounded-full flex-grow">
                      <div 
                        className="h-2 bg-blue-magical rounded-full" 
                        style={{ width: `${generatedCreature.magic * 10}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button
                  className="bg-purple-primary hover:bg-purple-primary/90 text-parchment"
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending || !world}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add to World
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-charcoal-dark/80 rounded-xl p-6 border border-blue-magical/30 shadow-xl flex flex-col items-center justify-center text-center">
              <Crown className="text-blue-magical/50 w-16 h-16 mb-4" />
              <h3 className="font-medieval text-xl text-blue-magical mb-2">No Creature Yet</h3>
              <p className="font-story text-parchment/70">
                Use the form to generate a unique creature for your world
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CreatureGenerator;
