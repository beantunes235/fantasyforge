import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { World, Creature, Story } from "@shared/schema";
import { Helmet } from "react-helmet";
import { 
  Mountain, 
  Wand2, 
  Users, 
  Scroll, 
  Edit, 
  Share2, 
  Crown, 
  BookOpen,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CreatureGenerator from "@/components/CreatureGenerator";
import StoryGenerator from "@/components/StoryGenerator";

const WorldDetail = () => {
  const { id } = useParams();
  const worldId = parseInt(id);

  const { data: world, isLoading: isLoadingWorld } = useQuery<World>({
    queryKey: [`/api/world/${worldId}`],
  });

  const { data: creatures = [], isLoading: isLoadingCreatures } = useQuery<Creature[]>({
    queryKey: [`/api/world/${worldId}/creatures`],
    enabled: !!worldId,
  });

  const { data: stories = [], isLoading: isLoadingStories } = useQuery<Story[]>({
    queryKey: [`/api/world/${worldId}/stories`],
    enabled: !!worldId,
  });

  if (isLoadingWorld) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!world) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="font-medieval text-2xl text-gold-mystical mb-4">World Not Found</h2>
        <p className="font-story text-parchment mb-8">
          The realm you seek does not exist or has vanished into the mists.
        </p>
        <Link href="/explore">
          <Button className="bg-blue-magical hover:bg-blue-magical/90 text-parchment">
            Explore Other Worlds
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{world.name} | MythicRealm</title>
        <meta name="description" content={world.description} />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <Link href="/my-worlds" className="inline-flex items-center text-parchment/80 hover:text-blue-magical mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Worlds
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="relative rounded-xl overflow-hidden shadow-2xl h-80 lg:h-96">
              <img 
                src={world.imageUrl} 
                alt={`The fantasy world of ${world.name}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-charcoal-dark/70 backdrop-blur-sm p-4">
                <h1 className="font-medieval text-3xl text-gold-mystical">{world.name}</h1>
                <p className="font-story text-parchment/90 mt-1">{world.description}</p>
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
              <Button className="bg-purple-primary hover:bg-purple-primary/90 text-parchment">
                <Edit className="w-4 h-4 mr-2" /> Edit World
              </Button>
              
              <Button className="bg-blue-magical hover:bg-blue-magical/90 text-parchment">
                <Share2 className="w-4 h-4 mr-2" /> Share World
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-charcoal-dark/80 rounded-xl overflow-hidden border border-blue-magical/30 shadow-xl mb-12">
          <Tabs defaultValue="creatures">
            <div className="p-4 border-b border-blue-magical/30">
              <TabsList className="bg-charcoal-dark/50 border border-blue-magical/30">
                <TabsTrigger 
                  value="creatures" 
                  className="data-[state=active]:bg-blue-magical data-[state=active]:text-parchment"
                >
                  <Crown className="w-4 h-4 mr-2" /> Creatures
                </TabsTrigger>
                <TabsTrigger 
                  value="stories" 
                  className="data-[state=active]:bg-blue-magical data-[state=active]:text-parchment"
                >
                  <BookOpen className="w-4 h-4 mr-2" /> Stories
                </TabsTrigger>
                <TabsTrigger 
                  value="new-creature" 
                  className="data-[state=active]:bg-blue-magical data-[state=active]:text-parchment"
                >
                  <Crown className="w-4 h-4 mr-2" /> New Creature
                </TabsTrigger>
                <TabsTrigger 
                  value="new-story" 
                  className="data-[state=active]:bg-blue-magical data-[state=active]:text-parchment"
                >
                  <BookOpen className="w-4 h-4 mr-2" /> New Story
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="creatures" className="p-6">
              {isLoadingCreatures ? (
                <div className="text-center py-8">
                  <LoadingSpinner size="md" />
                </div>
              ) : (
                <>
                  {creatures.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {creatures.map((creature) => (
                        <div key={creature.id} className="bg-charcoal-dark/60 rounded-lg overflow-hidden border border-blue-magical/20 shadow-lg hover:border-blue-magical/50 transition-all">
                          <div className="h-48 relative">
                            <img 
                              src={creature.imageUrl} 
                              alt={creature.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h3 className="font-medieval text-xl text-blue-magical mb-1">{creature.name}</h3>
                            <p className="font-story text-parchment/90 text-sm mb-3 line-clamp-3">
                              {creature.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Crown className="w-16 h-16 text-blue-magical/40 mx-auto mb-4" />
                      <h3 className="font-medieval text-xl text-blue-magical mb-2">No Creatures Yet</h3>
                      <p className="font-story text-parchment/80 mb-4">
                        This world has no inhabitants yet. Create some magical creatures!
                      </p>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
            
            <TabsContent value="stories" className="p-6">
              {isLoadingStories ? (
                <div className="text-center py-8">
                  <LoadingSpinner size="md" />
                </div>
              ) : (
                <>
                  {stories.length > 0 ? (
                    <div className="space-y-6">
                      {stories.map((story) => (
                        <div key={story.id} className="bg-charcoal-dark/60 rounded-lg overflow-hidden border border-blue-magical/20 shadow-lg hover:border-blue-magical/50 transition-all p-4">
                          <h3 className="font-medieval text-xl text-blue-magical mb-2">{story.title}</h3>
                          <p className="font-story text-parchment/90 text-sm mb-3 line-clamp-4">
                            {story.content.substring(0, 200)}...
                          </p>
                          <Button variant="outline" className="border-blue-magical/50 text-blue-magical hover:bg-blue-magical/10">
                            Read Full Story
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="w-16 h-16 text-blue-magical/40 mx-auto mb-4" />
                      <h3 className="font-medieval text-xl text-blue-magical mb-2">No Stories Yet</h3>
                      <p className="font-story text-parchment/80 mb-4">
                        There are no tales to tell of this realm yet. Create a story to bring this world to life!
                      </p>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
            
            <TabsContent value="new-creature" className="p-6">
              <CreatureGenerator world={world} />
            </TabsContent>
            
            <TabsContent value="new-story" className="p-6">
              <StoryGenerator world={world} creatures={creatures} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default WorldDetail;
