
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

interface SkillProgress {
  name: string;
  progress: number;
}

interface SkillsProgressProps {
  skills: SkillProgress[];
}

export const SkillsProgress = ({ skills }: SkillsProgressProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Progression des compétences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {skills.map((skill) => (
            <div key={skill.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{skill.name}</span>
                <span>{skill.progress}%</span>
              </div>
              <Progress value={skill.progress} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
