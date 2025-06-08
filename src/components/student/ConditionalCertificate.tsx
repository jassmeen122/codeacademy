
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Lock, Download, CheckCircle, Clock, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ConditionalCertificateProps {
  userFullName: string;
  isUnlocked: boolean;
  completedExercises: number;
  totalExercises: number;
  onDownload?: () => void;
  onView?: () => void;
}

export const ConditionalCertificate: React.FC<ConditionalCertificateProps> = ({
  userFullName,
  isUnlocked,
  completedExercises,
  totalExercises,
  onDownload,
  onView
}) => {
  const completionPercentage = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
  const currentDate = format(new Date(), 'dd MMMM yyyy', { locale: fr });

  return (
    <Card className={`professional-card transition-all duration-300 ${
      isUnlocked ? 'bg-gradient-to-br from-primary/5 to-accent/5 border-primary/30' : 'bg-muted/30 border-muted/50'
    }`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-display">
          <Award className={`h-6 w-6 ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className={isUnlocked ? 'text-primary' : 'text-muted-foreground'}>
            Certificat de Parcours Complet
          </span>
          {isUnlocked ? (
            <Badge className="bg-primary text-primary-foreground">
              <CheckCircle className="h-3 w-3 mr-1" />
              Validé
            </Badge>
          ) : (
            <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
              <Lock className="h-3 w-3 mr-1" />
              En attente
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Aperçu du certificat */}
          <div className={`relative p-8 rounded-lg border-2 transition-all duration-300 ${
            isUnlocked 
              ? 'bg-white border-primary/20 shadow-lg' 
              : 'bg-muted/20 border-muted/30'
          }`}>
            {!isUnlocked && (
              <div className="absolute inset-0 bg-muted/40 rounded-lg flex items-center justify-center z-10">
                <div className="text-center">
                  <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">Certificat verrouillé</p>
                </div>
              </div>
            )}
            
            <div className={`text-center space-y-4 ${!isUnlocked ? 'filter blur-sm' : ''}`}>
              <div className="text-3xl font-bold text-primary mb-4">
                🎓 CodeAcademy
              </div>
              
              <h2 className="text-xl font-semibold text-foreground">
                Certificat de Parcours Complet
              </h2>
              
              <div className="text-lg text-muted-foreground">
                Ce certificat atteste que
              </div>
              
              <div className="flex items-center justify-center gap-2 my-4">
                <User className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-primary">{userFullName}</span>
              </div>
              
              <div className="text-muted-foreground">
                a complété avec succès son parcours d'apprentissage en programmation
              </div>
              
              {isUnlocked ? (
                <div className="flex items-center justify-center gap-2 mt-6 text-sm text-primary">
                  <Calendar className="h-4 w-4" />
                  <span>Certificat validé avec succès le {currentDate}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>En attente de validation</span>
                </div>
              )}
            </div>
          </div>

          {/* Statut et progression */}
          <div className="space-y-4">
            {!isUnlocked && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">
                      Terminez tous les exercices pour obtenir votre certificat officiel
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      Progression : {completedExercises}/{totalExercises} exercices terminés ({completionPercentage}%)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isUnlocked && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">
                      Félicitations ! Votre certificat est maintenant disponible
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Vous avez terminé tous les exercices avec succès
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              {isUnlocked ? (
                <>
                  <Button onClick={onView} variant="outline" className="flex-1">
                    <Award className="h-4 w-4 mr-2" />
                    Voir le certificat
                  </Button>
                  <Button onClick={onDownload} className="flex-1 education-button">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger mon certificat
                  </Button>
                </>
              ) : (
                <>
                  <Button disabled variant="outline" className="flex-1">
                    <Award className="h-4 w-4 mr-2" />
                    Aperçu indisponible
                  </Button>
                  <Button disabled className="flex-1">
                    <Lock className="h-4 w-4 mr-2" />
                    Téléchargement verrouillé
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
