import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { generateStory, StoryGenerationRequest, saveStory } from "@/lib/openai";
import { MagicButton } from "@/components/ui/magic-button";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Loader2, Save, RefreshCw } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { Story, World, Creature } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface StoryGeneratorProps {
  world?: World | null;
  creatures?: Creature[];
}

const StoryGenerator = ({ world, creatures = [] }: StoryGeneratorProps) => {
  const { toast } = useToast();
  const [theme, setTheme] = useState("adventure");
  const [protagonist, setProtagonist] = useState("");
  const [setting, setSetting] = useState("");
  const [plotElements, setPlotElements] = useState<string[]>([
    "Ancient artifact discovery",
    "Confrontation with enemies"
  ]);
  const [generatedStory, setGeneratedStory] = useState<Story | null>(null);

  const availablePlotElements = [
    "Ancient artifact discovery",
    "Confrontation with enemies",
    "Royal intrigue",
    "Forbidden magic",
    "Natural disaster",
    "Hidden treasure",
    "Lost civilization"
  ];

  const storyMutation = useMutation({
    mutationFn: generateStory,
    onSuccess: (data) => {
      setGeneratedStory(data);
    },
    onError: (error) => {
      toast({
        title: "Failed to generate story",
        description: error.message || "Please try again with different parameters",
        variant: "destructive",
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: () => saveStory(generatedStory?.id || 0, world?.id || 0),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/stories'] });
      toast({
        title: "Story saved",
        description: `"${generatedStory?.title}" has been saved to your collection`,
      });
    },
    onError: () => {
      toast({
        title: "Failed to save story",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!theme || !protagonist || !setting || plotElements.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all story elements to generate a tale",
        variant: "destructive",
      });
      return;
    }

    const storyRequest: StoryGenerationRequest = {
      theme,
      protagonist,
      setting,
      plotElements,
      worldId: world?.id,
      creatureIds: creatures.map(c => c.id)
    };

    storyMutation.mutate(storyRequest);
  };

  const handlePlotElementToggle = (element: string) => {
    setPlotElements(prev => 
      prev.includes(element)
        ? prev.filter(e => e !== element)
        : [...prev, element]
    );
  };

  const continueStory = () => {
    if (!generatedStory) return;
    
    const storyRequest: StoryGenerationRequest = {
      theme,
      protagonist,
      setting,
      plotElements,
      worldId: world?.id,
      creatureIds: creatures.map(c => c.id)
    };

    storyMutation.mutate(storyRequest);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-purple-primary/20 to-charcoal-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-medieval text-3xl md:text-4xl text-gold-mystical mb-4">
            Weave Your Tale
          </h2>
          <p className="font-story text-parchment max-w-2xl mx-auto">
            Generate captivating stories set in your world featuring your unique characters and creatures.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-charcoal-dark/80 rounded-xl p-6 border border-blue-magical/30 shadow-xl">
            <h3 className="font-medieval text-xl text-blue-magical mb-4">Story Elements</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-ui font-medium text-parchment mb-2">Theme</label>
                <select 
                  className="w-full p-2 rounded-lg bg-charcoal-dark border border-blue-magical/50 text-parchment font-ui focus:outline-none focus:ring-2 focus:ring-gold-mystical"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  disabled={storyMutation.isPending}
                >
                  <option value="adventure">Adventure</option>
                  <option value="mystery">Mystery</option>
                  <option value="conflict">Conflict</option>
                  <option value="discovery">Discovery</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              
              <div>
                <label className="block font-ui font-medium text-parchment mb-2">Protagonist</label>
                <select 
                  className="w-full p-2 rounded-lg bg-charcoal-dark border border-blue-magical/50 text-parchment font-ui focus:outline-none focus:ring-2 focus:ring-gold-mystical"
                  value={protagonist}
                  onChange={(e) => setProtagonist(e.target.value)}
                  disabled={storyMutation.isPending}
                >
                  <option value="">Select a protagonist</option>
                  {creatures.map(creature => (
                    <option key={creature.id} value={creature.name}>
                      {creature.name}
                    </option>
                  ))}
                  <option value="custom">Add New Character</option>
                </select>
              </div>
              
              <div>
                <label className="block font-ui font-medium text-parchment mb-2">Setting</label>
                <select 
                  className="w-full p-2 rounded-lg bg-charcoal-dark border border-blue-magical/50 text-parchment font-ui focus:outline-none focus:ring-2 focus:ring-gold-mystical"
                  value={setting}
                  onChange={(e) => setSetting(e.target.value)}
                  disabled={storyMutation.isPending}
                >
                  <option value="">Select a setting</option>
                  {world?.regions?.map((region, index) => (
                    <option key={index} value={region}>
                      {region}
                    </option>
                  ))}
                  <option value={world?.region}>{world?.region}</option>
                  <option value="custom">Add New Setting</option>
                </select>
              </div>
              
              <div>
                <label className="block font-ui font-medium text-parchment mb-2">Plot Elements</label>
                <div className="space-y-2">
                  {availablePlotElements.map((element, index) => (
                    <div key={index} className="flex items-center">
                      <Checkbox 
                        id={`element-${index}`} 
                        checked={plotElements.includes(element)}
                        onCheckedChange={() => handlePlotElementToggle(element)}
                        disabled={storyMutation.isPending}
                      />
                      <Label 
                        htmlFor={`element-${index}`} 
                        className="ml-2 text-parchment font-ui"
                      >
                        {element}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center mt-4">
                <MagicButton 
                  type="submit"
                  className="bg-blue-magical hover:bg-blue-magical/90 text-parchment font-ui px-6 py-2 rounded-lg transition-all transform hover:scale-105"
                  disabled={storyMutation.isPending || !world}
                >
                  {storyMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Weaving...
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-5 h-5 mr-2" /> Weave Story
                    </>
                  )}
                </MagicButton>
              </div>
            </form>
          </div>
          
          <div className="lg:col-span-2">
            {generatedStory ? (
              <div className="scroll text-charcoal-dark p-8 rounded-lg relative">
                <div className="relative z-10">
                  <h3 className="font-medieval text-2xl text-purple-primary mb-4 text-center">
                    {generatedStory.title}
                  </h3>
                  
                  <div className="prose prose-lg max-w-none font-story">
                    {generatedStory.content.split('\n\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                  
                  <div className="mt-6 flex justify-center space-x-4">
                    <Button 
                      className="bg-purple-primary hover:bg-purple-primary/90 text-parchment font-ui"
                      onClick={() => saveMutation.mutate()}
                      disabled={saveMutation.isPending}
                    >
                      <Save className="w-4 h-4 mr-2" /> Save Story
                    </Button>
                    <Button 
                      className="bg-forest-green hover:bg-forest-green/90 text-parchment font-ui"
                      onClick={continueStory}
                      disabled={storyMutation.isPending}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" /> Continue Tale
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="scroll text-charcoal-dark p-8 rounded-lg relative">
                <div className="relative z-10 flex flex-col items-center justify-center h-64">
                  <BookOpen className="w-16 h-16 text-purple-primary/70 mb-4" />
                  <h3 className="font-medieval text-xl text-purple-primary mb-2">Your Tale Awaits</h3>
                  <p className="font-story text-center max-w-md">
                    Select your story elements and click "Weave Story" to generate a captivating tale set in your fantasy world.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoryGenerator;
