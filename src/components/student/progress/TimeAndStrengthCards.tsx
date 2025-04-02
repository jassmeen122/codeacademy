
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Star } from "lucide-react";
import { PieChart } from "./charts/PieChart";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const TimeAndStrengthCards = () => {
  const timeDistributionData = [
    { name: 'Vidéos', value: 40 },
    { name: 'Documentation', value: 25 },
    { name: 'Exercices', value: 30 },
    { name: 'Quiz', value: 5 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Distribution du temps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <PieChart 
              data={timeDistributionData}
              dataKey="value"
              nameKey="name"
              colors={COLORS}
              tooltipFormatter={(value) => `${value}%`}
              innerRadius={60}
              outerRadius={80}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Forces et points à améliorer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-sm mb-2">Points forts</h3>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Fondamentaux JavaScript (top 15%)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Conception de composants React (top 20%)
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Régularité d'apprentissage (top 10%)
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-sm mb-2">Points à améliorer</h3>
              <ul className="space-y-1 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  Types avancés TypeScript
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  Développement backend
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  Développement piloté par les tests
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
