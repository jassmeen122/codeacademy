
import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { CertificatesSection } from '@/components/student/CertificatesSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Trophy, Star, Target } from 'lucide-react';

const CertificatesPage = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8 gap-3">
          <Award className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">Mes Certificats</h1>
        </div>

        <div className="grid gap-8">
          {/* Section principale des certificats */}
          <CertificatesSection />

          {/* Informations sur les types de certificats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Star className="h-5 w-5" />
                  Certificat de Compétence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Obtenu en maîtrisant une compétence spécifique à 100%
                </p>
                <div className="text-xs text-muted-foreground">
                  Critères : Progression complète dans une compétence
                </div>
              </CardContent>
            </Card>

            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Target className="h-5 w-5" />
                  Certificat de Parcours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Décerné pour la completion d'un parcours d'apprentissage complet
                </p>
                <div className="text-xs text-muted-foreground">
                  Critères : 5+ badges, 3+ compétences à 80%
                </div>
              </CardContent>
            </Card>

            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Trophy className="h-5 w-5" />
                  Certificat d'Excellence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Récompense pour des performances exceptionnelles
                </p>
                <div className="text-xs text-muted-foreground">
                  Critères : Top 10% des étudiants
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Avantages des certificats */}
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="text-primary">
                Pourquoi obtenir des certificats ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Reconnaissance professionnelle</h4>
                  <p className="text-sm text-muted-foreground">
                    Validez vos compétences auprès des employeurs et ajoutez de la valeur à votre CV.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Motivation personnelle</h4>
                  <p className="text-sm text-muted-foreground">
                    Célébrez vos accomplissements et maintenez votre motivation d'apprentissage.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Vérification des compétences</h4>
                  <p className="text-sm text-muted-foreground">
                    Chaque certificat inclut un code de vérification unique pour authentifier vos compétences.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Partage sur les réseaux</h4>
                  <p className="text-sm text-muted-foreground">
                    Partagez vos réussites sur LinkedIn et autres plateformes professionnelles.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CertificatesPage;
