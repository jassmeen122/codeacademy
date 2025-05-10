
import React from "react";

export const GameInstructions = () => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">
        Testez vos connaissances en programmation
      </h2>
      <p className="text-gray-600">
        Répondez aux questions pour gagner des points et débloquer des
        badges. Les questions sont classées par niveau de difficulté:
      </p>
      <ul className="list-disc list-inside mt-2 mb-6 text-gray-600">
        <li>
          <span className="font-medium text-green-600">Débutant</span>
          : 10 questions fondamentales
        </li>
        <li>
          <span className="font-medium text-yellow-600">Intermédiaire</span>
          : 30 questions plus avancées
        </li>
        <li>
          <span className="font-medium text-red-600">Avancé</span>
          : 70 questions expertes
        </li>
      </ul>
      <p className="text-sm text-gray-500 italic">
        Besoin d'aide? Utilisez l'assistant IA en bas à droite de votre écran!
      </p>
    </div>
  );
};
