
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Lock, Download, CheckCircle, Clock, User, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface LanguageProgress {
  name: string;
  status: 'completed' | 'in_progress' | 'locked';
  progress: number;
}

interface ProgrammingLanguagesCertificateProps {
  userFullName: string;
  languages: LanguageProgress[];
  isUnlocked: boolean;
  onDownload?: () => void;
  onView?: () => void;
}

export const ProgrammingLanguagesCertificate: React.FC<ProgrammingLanguagesCertificateProps> = ({
  userFullName,
  languages,
  isUnlocked,
  onDownload,
  onView
}) => {
  const completedLanguages = languages.filter(lang => lang.status === 'completed').length;
  const totalLanguages = languages.length;
  const currentDate = format(new Date(), 'dd MMMM yyyy', { locale: fr });

  const getLanguageIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'locked':
        return <Lock className="h-4 w-4 text-gray-400" />;
      default:
        return <Lock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getLanguageColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-700';
      case 'in_progress':
        return 'text-blue-700';
      case 'locked':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Validé';
      case 'in_progress':
        return 'En cours';
      case 'locked':
        return 'Pas encore validé';
      default:
        return 'Pas encore validé';
    }
  };

  return (
    <Card className={`professional-card transition-all duration-300 ${
      isUnlocked ? 'bg-gradient-to-br from-primary/5 to-accent/5 border-primary/30' : 'bg-muted/30 border-muted/50'
    }`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-display">
          <Award className={`h-6 w-6 ${isUnlocked ? 'text-primary' : 'text-muted-foreground'}`} />
          <span className={isUnlocked ? 'text-primary' : 'text-muted-foreground'}>
            Certificat de Maîtrise en Langages de Programmation
          </span>
          {isUnlocked ? (
            <Badge className="bg-primary text-primary-foreground">
              <CheckCircle className="h-3 w-3 mr-1" />
              Validé
            </Badge>
          ) : (
            <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">
              <Lock className="h-3 w-3 mr-1" />
              Non validé
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
              : 'bg-white border-muted/30'
          }`}>
            {/* Filigrane */}
            {!isUnlocked && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="transform rotate-45 text-6xl font-bold text-gray-200 opacity-30">
                  NON VALIDÉ
                </div>
              </div>
            )}
            
            <div className="text-center space-y-6 relative">
              <div className="text-3xl font-bold text-primary mb-4">
                🎓 CERTIFICAT DE MAÎTRISE
              </div>
              
              <h2 className="text-xl font-semibold text-foreground">
                Développement Web - Langages de Programmation
              </h2>
              
              <div className="text-lg text-muted-foreground">
                Ce certificat est délivré à :
              </div>
              
              <div className="flex items-center justify-center gap-2 my-4">
                <User className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-primary" style={{ fontSize: '26px' }}>
                  {userFullName}
                </span>
              </div>
              
              <div className="text-muted-foreground mb-6">
                pour avoir suivi le parcours de formation en Développement Web<br />
                et démontré ses compétences en maîtrisant les langages suivants :
              </div>
              
              {/* Liste des langages */}
              <div className="space-y-3 mb-6">
                {languages.map((language, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      {getLanguageIcon(language.status)}
                      <span className={`font-medium ${getLanguageColor(language.status)}`}>
                        {language.name}
                      </span>
                    </div>
                    <span className={`text-sm ${getLanguageColor(language.status)}`}>
                      {getStatusText(language.status)}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Progression */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-lg font-semibold text-blue-800 mb-2">
                  🧩 Progrès : {completedLanguages}/{totalLanguages} langages complétés
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedLanguages / totalLanguages) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Date */}
              {isUnlocked ? (
                <div className="flex items-center justify-center gap-2 mt-6 text-sm text-primary">
                  <Calendar className="h-4 w-4" />
                  <span>📅 Certificat validé avec succès le {currentDate}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>📅 Date prévue de validation : À déterminer</span>
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
                      Terminez tous les langages pour obtenir votre certificat officiel
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      Complétez tous les exercices de chaque langage avec au moins 80% de réussite
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
                      Félicitations ! Votre certificat de maîtrise est maintenant disponible
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Vous avez maîtrisé tous les langages de programmation avec succès
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
                    Télécharger mon certificat PDF
                  </Button>
                </>
              ) : (
                <>
                  <Button disabled variant="outline" className="flex-1" title="Complétez tous les exercices pour activer le téléchargement">
                    <Award className="h-4 w-4 mr-2" />
                    Aperçu indisponible
                  </Button>
                  <Button disabled className="flex-1" title="Complétez tous les exercices pour activer le téléchargement">
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
