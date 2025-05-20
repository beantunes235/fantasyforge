import { Link } from "wouter";
import { Crown } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-charcoal-dark py-12 border-t border-blue-magical/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center mb-4">
              <Crown className="text-gold-mystical w-6 h-6 mr-3" />
              <h3 className="font-medieval text-2xl text-gold-mystical">MythicRealm</h3>
            </Link>
            <p className="font-story text-parchment/80 mb-4">
              Unleash your creativity with AI-powered fantasy world generation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-parchment/60 hover:text-blue-magical transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-parchment/60 hover:text-blue-magical transition-colors">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-parchment/60 hover:text-blue-magical transition-colors">
                <i className="fab fa-discord text-xl"></i>
              </a>
              <a href="#" className="text-parchment/60 hover:text-blue-magical transition-colors">
                <i className="fab fa-reddit text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-medieval text-lg text-blue-magical mb-4">Features</h4>
            <ul className="space-y-2 font-ui text-parchment/80">
              <li><Link href="/#world-generator" className="hover:text-blue-magical transition-colors">World Generation</Link></li>
              <li><Link href="/creatures" className="hover:text-blue-magical transition-colors">Creature Creator</Link></li>
              <li><Link href="/stories" className="hover:text-blue-magical transition-colors">Story Weaver</Link></li>
              <li><Link href="/explore" className="hover:text-blue-magical transition-colors">World Explorer</Link></li>
              <li><Link href="/gallery" className="hover:text-blue-magical transition-colors">Community Gallery</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medieval text-lg text-blue-magical mb-4">Resources</h4>
            <ul className="space-y-2 font-ui text-parchment/80">
              <li><Link href="/help" className="hover:text-blue-magical transition-colors">Help Center</Link></li>
              <li><Link href="/guide" className="hover:text-blue-magical transition-colors">World Building Guide</Link></li>
              <li><Link href="/api" className="hover:text-blue-magical transition-colors">API Documentation</Link></li>
              <li><Link href="/rules" className="hover:text-blue-magical transition-colors">Community Rules</Link></li>
              <li><Link href="/pricing" className="hover:text-blue-magical transition-colors">Pricing Plans</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medieval text-lg text-blue-magical mb-4">Company</h4>
            <ul className="space-y-2 font-ui text-parchment/80">
              <li><Link href="/about" className="hover:text-blue-magical transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-blue-magical transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="hover:text-blue-magical transition-colors">Careers</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-magical transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-magical transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-magical/20 mt-8 pt-8 text-center">
          <p className="font-ui text-parchment/60 text-sm">
            &copy; {new Date().getFullYear()} MythicRealm. All rights reserved. Powered by AI magic.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
