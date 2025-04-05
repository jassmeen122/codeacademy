
import React from "react";
import { Target, Trophy, Medal } from "lucide-react";

export const GameInstructions = () => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2 flex items-center">
        <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
        Developer Achievements System
      </h2>
      <p className="text-gray-600 mb-4">
        Complete challenges to earn experience points and unlock developer badges. Track your progress and compete with other developers.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="border rounded-md p-4 bg-blue-50">
          <div className="flex items-center mb-2">
            <Target className="h-4 w-4 text-blue-600 mr-2" />
            <h3 className="font-medium">Daily Challenges</h3>
          </div>
          <p className="text-sm text-gray-600">
            Quick tasks that refresh every 24 hours. Complete them for quick XP boosts.
          </p>
          <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
            <li>Write code snippets</li>
            <li>Review documentation</li>
            <li>Complete short quizzes</li>
          </ul>
        </div>
        
        <div className="border rounded-md p-4 bg-purple-50">
          <div className="flex items-center mb-2">
            <Trophy className="h-4 w-4 text-purple-600 mr-2" />
            <h3 className="font-medium">Weekly Challenges</h3>
          </div>
          <p className="text-sm text-gray-600">
            More complex tasks that reset weekly. These offer higher XP rewards.
          </p>
          <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
            <li>Complete projects</li>
            <li>Contribute to repositories</li>
            <li>Help other developers</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-4 border rounded-md p-4 bg-green-50">
        <div className="flex items-center mb-2">
          <Medal className="h-4 w-4 text-green-600 mr-2" />
          <h3 className="font-medium">Skill Mastery</h3>
        </div>
        <p className="text-sm text-gray-600">
          Demonstrate your programming expertise by completing challenges in specific categories:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Frontend Development</span>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Backend Development</span>
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Database Design</span>
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">DevOps</span>
          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">System Architecture</span>
          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">API Development</span>
        </div>
      </div>
    </div>
  );
};
