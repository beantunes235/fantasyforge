import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { World } from "@shared/schema";
import { PlusCircle, Wand2, BookOpen, Crown, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Helmet } from "react-helmet";

const MyWorlds = () => {
  const { data: myWorlds, isLoading } = useQuery<World[]>({
    queryKey: ['/api/worlds/my-worlds'],
  });

  return (
    <>
      <Helmet>
        <title>My Fantasy Worlds | MythicRealm</title>
        <meta name="description" content="Manage your created fantasy worlds, creatures, and stories. Continue building your magical realms at MythicRealm." />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h1 className="font-medieval text-3xl md:text-4xl text-gold-mystical mb-2">
                My Magical Realms
              </h1>
              <p className="font-story text-parchment/80">
                Manage your fantasy worlds, creatures, and stories.
              </p>
            </div>
            <Link href="/">
              <Button className="mt-4 md:mt-0 bg-blue-magical hover:bg-blue-magical/90 text-parchment">
                <PlusCircle className="w-4 h-4 mr-2" /> Create New World
              </Button>
            </Link>
          </div>

          <div className="bg-charcoal-dark/80 rounded-xl p-6 border border-blue-magical/30 shadow-xl">
            <Tabs defaultValue="worlds">
              <TabsList className="bg-charcoal-dark/50 border border-blue-magical/30 mb-6">
                <TabsTrigger 
                  value="worlds" 
                  className="data-[state=active]:bg-blue-magical data-[state=active]:text-parchment"
                >
                  Worlds
                </TabsTrigger>
                <TabsTrigger 
                  value="creatures" 
                  className="data-[state=active]:bg-blue-magical data-[state=active]:text-parchment"
                >
                  Creatures
                </TabsTrigger>
                <TabsTrigger 
                  value="stories" 
                  className="data-[state=active]:bg-blue-magical data-[state=active]:text-parchment"
                >
                  Stories
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="worlds">
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-32 rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <>
                    {myWorlds && myWorlds.length > 0 ? (
                      <div className="space-y-4">
                        {myWorlds.map((world) => (
                          <div 
                            key={world.id} 
                            className="bg-charcoal-dark/60 border border-blue-magical/20 rounded-xl overflow-hidden flex flex-col sm:flex-row hover:border-blue-magical/50 transition-all"
                          >
                            <div className="w-full sm:w-1/4 h-32 sm:h-auto">
                              <img 
                                src={world.imageUrl} 
                                alt={world.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-4 flex-1">
                              <h3 className="font-medieval text-xl text-blue-magical mb-2">{world.name}</h3>
                              <p className="font-story text-parchment/90 text-sm mb-3 line-clamp-2">
                                {world.description}
                              </p>
                              
                              <div className="flex flex-wrap justify-between items-center gap-2">
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center">
                                    <Crown className="text-gold-mystical w-4 h-4 mr-1" />
                                    <span className="text-xs text-parchment/80 font-ui">
                                      {world.creatureCount || 0}
                                    </span>
                                  </div>
                                  <div className="flex items-center">
                                    <BookOpen className="text-gold-mystical w-4 h-4 mr-1" />
                                    <span className="text-xs text-parchment/80 font-ui">
                                      {world.storyCount || 0}
                                    </span>
                                  </div>
                                  <div className="text-xs text-parchment/60 font-ui">
                                    Created {new Date(world.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Link href={`/world/${world.id}`}>
                                    <Button variant="outline" size="sm" className="border-blue-magical/50 text-blue-magical hover:bg-blue-magical/10">
                                      <Wand2 className="w-3 h-3 mr-1" /> Edit
                                    </Button>
                                  </Link>
                                  <Button variant="outline" size="sm" className="border-destructive/50 text-destructive hover:bg-destructive/10">
                                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Wand2 className="w-16 h-16 text-blue-magical/40 mx-auto mb-4" />
                        <h3 className="font-medieval text-xl text-blue-magical mb-2">No Worlds Yet</h3>
                        <p className="font-story text-parchment/80 mb-6">
                          You haven't created any fantasy worlds yet. Start your journey now!
                        </p>
                        <Link href="/">
                          <Button className="bg-blue-magical hover:bg-blue-magical/90 text-parchment">
                            Create Your First World
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="creatures">
                {/* Similar structure to "worlds" tab but for creatures */}
                <div className="text-center py-12">
                  <Crown className="w-16 h-16 text-blue-magical/40 mx-auto mb-4" />
                  <h3 className="font-medieval text-xl text-blue-magical mb-2">No Creatures Yet</h3>
                  <p className="font-story text-parchment/80 mb-6">
                    You haven't created any mythical creatures yet. Create a world first, then populate it!
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="stories">
                {/* Similar structure to "worlds" tab but for stories */}
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-blue-magical/40 mx-auto mb-4" />
                  <h3 className="font-medieval text-xl text-blue-magical mb-2">No Stories Yet</h3>
                  <p className="font-story text-parchment/80 mb-6">
                    You haven't written any magical tales yet. Create a world and creatures, then weave a story!
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyWorlds;
