import { Link } from "wouter";
import { MagicButton } from "@/components/ui/magic-button";
import { UserPlus, Crown } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-20 bg-cover bg-center relative" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504805572947-34fad45aed93?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80')" }}>
      <div className="absolute inset-0 bg-charcoal-dark/80"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-medieval text-3xl md:text-5xl text-gold-mystical mb-6">
            Begin Your Legendary Journey
          </h2>
          <p className="font-story text-xl text-parchment mb-8">
            Create your account now and start crafting unlimited fantasy worlds powered by AI. 
            Your imagination is the only limit.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <MagicButton className="bg-blue-magical hover:bg-blue-magical/90 text-parchment font-ui text-lg px-8 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg">
                <UserPlus className="w-5 h-5 mr-2" /> Create Free Account
              </MagicButton>
            </Link>
            <Link href="/premium">
              <button className="bg-purple-primary hover:bg-purple-primary/90 text-parchment font-ui text-lg px-8 py-4 rounded-lg transition-all shadow-lg">
                <Crown className="w-5 h-5 mr-2 inline-block" /> Upgrade to Premium
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
