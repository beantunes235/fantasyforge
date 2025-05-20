import { MagicButton } from "@/components/ui/magic-button";
import { Link } from "wouter";
import { Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative bg-cover bg-center min-h-screen flex items-center" 
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80')" 
      }}>
      <div className="absolute inset-0 bg-charcoal-dark/60"></div>
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-medieval text-4xl md:text-6xl mb-6 text-gold-mystical">
            Create Your Legendary World
          </h1>
          <p className="font-story text-lg md:text-xl mb-8 text-parchment">
            Forge fantastical realms, mythical creatures, and epic tales using the power of AI. 
            Your imagination is the only limit.
          </p>
          <Link href="#world-generator">
            <MagicButton className="bg-blue-magical hover:bg-blue-magical/90 text-parchment font-ui text-lg px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg">
              <Sparkles className="w-5 h-5 mr-2" /> Begin Your Adventure
            </MagicButton>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
