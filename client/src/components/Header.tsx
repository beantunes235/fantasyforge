import { Link, useLocation } from "wouter";
import { useState } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  Crown, 
  Menu,
  Home,
  Compass,
  BookOpen,
  Info
} from "lucide-react";
import { ApiStatusIndicator } from "@/components/ui/ApiStatusIndicator";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const navItems = [
    { name: "Home", path: "/", icon: <Home className="w-4 h-4 mr-2" /> },
    { name: "My Worlds", path: "/my-worlds", icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { name: "Explore", path: "/explore", icon: <Compass className="w-4 h-4 mr-2" /> },
    { name: "About", path: "#about", icon: <Info className="w-4 h-4 mr-2" /> }
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-charcoal-dark/80 backdrop-blur-md fixed w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Crown className="text-gold-mystical w-6 h-6 mr-3" />
          <h1 className="font-medieval text-2xl md:text-3xl text-gold-mystical">MythicRealm</h1>
        </Link>
        
        <nav className="hidden md:flex space-x-6 font-ui">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`text-parchment hover:text-blue-magical transition-colors ${
                isActive(item.path) ? "text-blue-magical" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <ApiStatusIndicator />
          </div>
          <button className="bg-purple-primary hover:bg-purple-primary/90 text-parchment font-ui px-4 py-2 rounded-lg transition">
            Sign In
          </button>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger className="md:hidden">
              <Menu className="text-parchment w-6 h-6" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-charcoal-dark border-purple-primary/30">
              <div className="flex flex-col space-y-6 mt-8 font-ui">
                <div className="mb-2">
                  <ApiStatusIndicator />
                </div>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`flex items-center text-parchment hover:text-blue-magical transition-colors ${
                      isActive(item.path) ? "text-blue-magical" : ""
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
