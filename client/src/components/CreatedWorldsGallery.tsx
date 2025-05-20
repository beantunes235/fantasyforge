import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { MagicButton } from "@/components/ui/magic-button";
import { World } from "@shared/schema";
import { Compass, Crown, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface CreatedWorldsGalleryProps {
  featured?: boolean;
  limit?: number;
}

const CreatedWorldsGallery = ({ featured = true, limit = 3 }: CreatedWorldsGalleryProps) => {
  const { data: worlds, isLoading } = useQuery<World[]>({
    queryKey: ['/api/worlds', featured ? 'featured' : 'all'],
  });

  const displayWorlds = worlds?.slice(0, limit);

  return (
    <section className="py-16 bg-gradient-to-b from-charcoal-dark to-purple-primary/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-medieval text-3xl md:text-4xl text-gold-mystical mb-4">
            Discover Fantastical Realms
          </h2>
          <p className="font-story text-parchment max-w-2xl mx-auto">
            Explore worlds created by our community or revisit your own creations.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="bg-charcoal-dark/80 rounded-xl overflow-hidden border border-blue-magical/30 shadow-xl">
                <Skeleton className="h-48 w-full" />
                <div className="p-5">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-8 w-20 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {displayWorlds && displayWorlds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayWorlds.map((world) => (
                  <div 
                    key={world.id} 
                    className="bg-charcoal-dark/80 rounded-xl overflow-hidden border border-blue-magical/30 shadow-xl transition-transform hover:scale-105"
                  >
                    <div className="h-48 relative">
                      <img 
                        src={world.imageUrl} 
                        alt={world.name} 
                        className="w-full h-full object-cover"
                      />
                      {world.featured && (
                        <div className="absolute top-3 right-3 bg-blue-magical/90 text-xs text-parchment font-ui px-2 py-1 rounded-full">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-medieval text-xl text-blue-magical mb-2">{world.name}</h3>
                      <p className="font-story text-parchment/90 text-sm mb-4 line-clamp-2">
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
                        <Link href={`/world/${world.id}`}>
                          <button className="text-xs bg-purple-primary hover:bg-purple-primary/90 text-parchment font-ui px-3 py-1 rounded-lg transition">
                            Explore
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-charcoal-dark/50 rounded-xl max-w-xl mx-auto">
                <Crown className="w-16 h-16 text-blue-magical/50 mx-auto mb-4" />
                <h3 className="font-medieval text-xl text-blue-magical mb-2">No Worlds Yet</h3>
                <p className="font-story text-parchment/80 mb-6">
                  Start creating your own fantasy worlds or explore featured realms from our community.
                </p>
                <Link href="/">
                  <button className="bg-blue-magical hover:bg-blue-magical/90 text-parchment font-ui px-6 py-2 rounded-lg transition">
                    Create Your First World
                  </button>
                </Link>
              </div>
            )}
          </>
        )}

        <div className="flex justify-center mt-12">
          <Link href="/explore">
            <MagicButton className="bg-blue-magical hover:bg-blue-magical/90 text-parchment font-ui px-8 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg">
              <Compass className="w-5 h-5 mr-2" /> Explore More Worlds
            </MagicButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CreatedWorldsGallery;
