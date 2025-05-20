import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { World } from "@shared/schema";
import { Compass, Search, Filter, Crown, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet";

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const { data: worlds, isLoading } = useQuery<World[]>({
    queryKey: ['/api/worlds', 'all'],
  });

  const filteredWorlds = worlds?.filter(world => {
    const matchesSearch = world.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          world.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "featured") return matchesSearch && world.featured;
    if (filter === "popular") return matchesSearch && (world.creatureCount > 5 || world.storyCount > 3);
    
    return matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Explore Fantasy Worlds | MythicRealm</title>
        <meta name="description" content="Discover amazing fantasy worlds created by the MythicRealm community. Browse featured realms, mythical creatures, and epic tales." />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-medieval text-4xl md:text-5xl text-gold-mystical mb-6">
              Explore Magical Realms
            </h1>
            <p className="font-story text-lg text-parchment max-w-2xl mx-auto">
              Discover fantastical worlds created by our community of adventurers, storytellers, and dreamers.
            </p>
          </div>

          <div className="bg-charcoal-dark/80 rounded-xl p-6 mb-8 border border-blue-magical/30">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-parchment/60 h-4 w-4" />
                <Input 
                  type="text"
                  placeholder="Search worlds..."
                  className="pl-10 bg-charcoal-dark border-blue-magical/50 text-parchment w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Button className="bg-purple-primary hover:bg-purple-primary/90 text-parchment w-full md:w-auto">
                  <Filter className="w-4 h-4 mr-2" /> Filter
                </Button>
              </div>
            </div>

            <Tabs defaultValue="all">
              <TabsList className="bg-charcoal-dark/50 border border-blue-magical/30">
                <TabsTrigger 
                  value="all" 
                  onClick={() => setFilter("all")}
                  className="data-[state=active]:bg-blue-magical data-[state=active]:text-parchment"
                >
                  All Worlds
                </TabsTrigger>
                <TabsTrigger 
                  value="featured" 
                  onClick={() => setFilter("featured")}
                  className="data-[state=active]:bg-blue-magical data-[state=active]:text-parchment"
                >
                  Featured
                </TabsTrigger>
                <TabsTrigger 
                  value="popular" 
                  onClick={() => setFilter("popular")}
                  className="data-[state=active]:bg-blue-magical data-[state=active]:text-parchment"
                >
                  Popular
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-6">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="h-48 rounded-xl" />
                    ))}
                  </div>
                ) : (
                  <>
                    {filteredWorlds && filteredWorlds.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredWorlds.map((world) => (
                          <Link key={world.id} href={`/world/${world.id}`}>
                            <div className="bg-charcoal-dark/60 border border-blue-magical/20 rounded-xl overflow-hidden flex flex-col md:flex-row hover:border-blue-magical/50 transition-all hover:bg-charcoal-dark/80 cursor-pointer">
                              <div className="w-full md:w-1/3 h-36">
                                <img 
                                  src={world.imageUrl} 
                                  alt={world.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="p-4 flex-1">
                                <h3 className="font-medieval text-xl text-blue-magical mb-1">{world.name}</h3>
                                <p className="font-story text-parchment/90 text-sm mb-3 line-clamp-2">
                                  {world.description}
                                </p>
                                
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center space-x-2">
                                    <Crown className="text-gold-mystical w-4 h-4" />
                                    <span className="text-xs text-parchment/80 font-ui">
                                      {world.creatureCount || 0} Creatures
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <BookOpen className="text-gold-mystical w-4 h-4" />
                                    <span className="text-xs text-parchment/80 font-ui">
                                      {world.storyCount || 0} Stories
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Compass className="w-16 h-16 text-blue-magical/40 mx-auto mb-4" />
                        <h3 className="font-medieval text-xl text-blue-magical mb-2">No Worlds Found</h3>
                        <p className="font-story text-parchment/80">
                          Try adjusting your search or create a new world of your own.
                        </p>
                        <Link href="/">
                          <Button className="mt-4 bg-blue-magical hover:bg-blue-magical/90 text-parchment">
                            Create New World
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="featured" className="mt-6">
                {/* Same content structure as "all" tab but with featured filter */}
              </TabsContent>
              
              <TabsContent value="popular" className="mt-6">
                {/* Same content structure as "all" tab but with popular filter */}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Explore;
