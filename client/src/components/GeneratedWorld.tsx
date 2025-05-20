import { World } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { saveWorld } from "@/lib/openai";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Edit, Mountain, Wand2, Users, Scroll, Save } from "lucide-react";

interface GeneratedWorldProps {
  world: World | null;
  onRefine: () => void;
}

const GeneratedWorld = ({ world, onRefine }: GeneratedWorldProps) => {
  const { toast } = useToast();

  const saveMutation = useMutation({
    mutationFn: () => saveWorld(world?.id || 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/worlds'] });
      toast({
        title: "World saved",
        description: "Your fantasy world has been saved to your collection",
      });
    },
    onError: () => {
      toast({
        title: "Failed to save world",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  if (!world) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-purple-primary/30 to-charcoal-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-medieval text-3xl md:text-4xl text-gold-mystical mb-4">
            {world.name}
          </h2>
          <p className="font-story text-parchment max-w-3xl mx-auto">
            {world.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <div className="relative rounded-xl overflow-hidden shadow-2xl h-80 lg:h-full">
              <img 
                src={world.imageUrl} 
                alt={`The fantasy world of ${world.name}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-charcoal-dark/70 backdrop-blur-sm p-4">
                <h3 className="font-medieval text-gold-mystical">{world.region}</h3>
              </div>
            </div>
          </div>

          <div className="bg-charcoal-dark/80 rounded-xl p-6 border border-blue-magical/30 shadow-xl">
            <h3 className="font-medieval text-2xl text-blue-magical mb-4">
              World Characteristics
            </h3>
            <ul className="space-y-4 font-story">
              <li className="flex items-start">
                <Mountain className="text-gold-mystical w-5 h-5 mt-1 mr-3" />
                <div>
                  <h4 className="font-ui font-medium">Geography</h4>
                  <p className="text-parchment/90">{world.geography}</p>
                </div>
              </li>
              <li className="flex items-start">
                <Wand2 className="text-gold-mystical w-5 h-5 mt-1 mr-3" />
                <div>
                  <h4 className="font-ui font-medium">Magic</h4>
                  <p className="text-parchment/90">{world.magic}</p>
                </div>
              </li>
              <li className="flex items-start">
                <Users className="text-gold-mystical w-5 h-5 mt-1 mr-3" />
                <div>
                  <h4 className="font-ui font-medium">Inhabitants</h4>
                  <p className="text-parchment/90">{world.inhabitants}</p>
                </div>
              </li>
              <li className="flex items-start">
                <Scroll className="text-gold-mystical w-5 h-5 mt-1 mr-3" />
                <div>
                  <h4 className="font-ui font-medium">History</h4>
                  <p className="text-parchment/90">{world.history}</p>
                </div>
              </li>
            </ul>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                className="bg-purple-primary hover:bg-purple-primary/90 text-parchment"
                onClick={onRefine}
              >
                <Edit className="w-4 h-4 mr-2" /> Refine World
              </Button>
              
              <Button
                className="bg-blue-magical hover:bg-blue-magical/90 text-parchment"
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" /> Save World
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GeneratedWorld;
