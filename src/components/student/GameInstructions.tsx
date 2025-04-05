
import React from "react";

export const GameInstructions = () => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">
        Test your programming knowledge
      </h2>
      <p className="text-gray-600">
        Answer questions to earn points and unlock badges. Questions are categorized by difficulty level:
      </p>
      <ul className="list-disc list-inside mt-2 mb-4 text-gray-600">
        <li>
          <span className="font-medium text-green-600">Beginner</span>
          : 10 fundamental questions
        </li>
        <li>
          <span className="font-medium text-yellow-600">Intermediate</span>
          : 30 more advanced questions
        </li>
        <li>
          <span className="font-medium text-red-600">Advanced</span>
          : 70 expert-level questions
        </li>
      </ul>
    </div>
  );
};
