
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Lamri",
      role: "Développeuse Web Junior",
      content: "Grâce à ces cours, j'ai pu acquérir les compétences nécessaires pour décrocher mon premier emploi en tant que développeuse web. La qualité des explications et les exercices pratiques ont fait toute la différence.",
      avatar: "SL"
    },
    {
      name: "Ahmed Benyahia",
      role: "Étudiant en Informatique",
      content: "Je recommande vivement cette plateforme à tous les étudiants qui souhaitent approfondir leurs connaissances en programmation. Les cours sont bien structurés et les professeurs sont très pédagogues.",
      avatar: "AB"
    },
    {
      name: "Nadia Moussaoui",
      role: "Reconversion Professionnelle",
      content: "En pleine reconversion professionnelle, j'ai trouvé dans cette plateforme tous les outils pour apprendre à mon rythme. Je maîtrise maintenant Python et JavaScript, ce qui m'a permis de changer de carrière.",
      avatar: "NM"
    }
  ];

  return (
    <section className="py-20 bg-blue-50/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ce que nos étudiants disent</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les témoignages de ceux qui ont transformé leur carrière grâce à nos cours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
