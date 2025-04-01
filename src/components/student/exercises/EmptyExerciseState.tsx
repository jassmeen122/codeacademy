
import React from "react";

export const EmptyExerciseState: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center">
      <div className="text-center">
        <h3 className="text-xl font-medium text-gray-600 mb-2">Sélectionnez un exercice</h3>
        <p className="text-gray-500">Choisissez un exercice dans la liste de gauche pour commencer</p>
      </div>
    </div>
  );
};
