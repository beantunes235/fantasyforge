import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import WorldGenerator from "@/components/WorldGenerator";
import GeneratedWorld from "@/components/GeneratedWorld";
import CreatureGenerator from "@/components/CreatureGenerator";
import StoryGenerator from "@/components/StoryGenerator";
import CreatedWorldsGallery from "@/components/CreatedWorldsGallery";
import CallToAction from "@/components/CallToAction";
import { World } from "@shared/schema";
import { Helmet } from "react-helmet";

const Home = () => {
  const [generatedWorld, setGeneratedWorld] = useState<World | null>(null);

  const handleWorldGenerated = (world: World) => {
    setGeneratedWorld(world);
    // Scroll to the generated world section
    setTimeout(() => {
      const worldSection = document.getElementById("generated-world");
      worldSection?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleRefineWorld = () => {
    // Scroll back to the world generator section
    const generatorSection = document.getElementById("world-generator");
    generatorSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Helmet>
        <title>MythicRealm - AI Fantasy World Generator</title>
        <meta name="description" content="Create captivating fantasy worlds, mythical creatures, and epic stories using AI. Your imagination is the only limit at MythicRealm." />
      </Helmet>

      <HeroSection />
      
      <WorldGenerator onWorldGenerated={handleWorldGenerated} />
      
      <div id="generated-world">
        <GeneratedWorld world={generatedWorld} onRefine={handleRefineWorld} />
      </div>
      
      <CreatureGenerator world={generatedWorld} />
      
      <StoryGenerator world={generatedWorld} />
      
      <CreatedWorldsGallery featured={true} limit={3} />
      
      <CallToAction />
    </>
  );
};

export default Home;
