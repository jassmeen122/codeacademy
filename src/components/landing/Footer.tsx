
import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">CodeAcademy</h3>
            <p className="mb-4">
              Notre mission est de rendre l'apprentissage de la programmation accessible à tous, 
              avec des cours de qualité conçus par des experts.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-primary transition-colors">Connexion</Link>
              </li>
              <li>
                <Link to="/auth?tab=register" className="hover:text-primary transition-colors">Inscription</Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition-colors">À propos</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Cours populaires</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/auth" className="hover:text-primary transition-colors">Python</Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-primary transition-colors">JavaScript</Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-primary transition-colors">Java</Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-primary transition-colors">SQL</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:contact@codeacademy.com" className="hover:text-primary transition-colors">
                  contact@codeacademy.com
                </a>
              </li>
              <li>
                <a href="tel:+212600000000" className="hover:text-primary transition-colors">
                  +212 6 00 00 00 00
                </a>
              </li>
              <li>
                <address className="not-italic">
                  Casablanca, Maroc
                </address>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="bg-gray-700 my-8" />
        
        <div className="text-center text-sm">
          <p>&copy; {new Date().getFullYear()} CodeAcademy. Tous droits réservés.</p>
          <div className="mt-2 space-x-4">
            <Link to="#" className="hover:text-primary transition-colors">Mentions légales</Link>
            <Link to="#" className="hover:text-primary transition-colors">Politique de confidentialité</Link>
            <Link to="#" className="hover:text-primary transition-colors">Conditions d'utilisation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
