
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Lock, Download, CheckCircle, Clock, User, Calendar, Loader2, Shield } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface LanguageProgress {
  name: string;
  status: 'completed' | 'in_progress' | 'locked';
  progress: number;
}

interface ProgrammingLanguagesCertificateProps {
  userFullName: string;
  userBirthDate?: string;
  platformName?: string;
  languages: LanguageProgress[];
  isUnlocked: boolean;
  onDownload?: () => void;
  onView?: () => void;
}

export const ProgrammingLanguagesCertificate: React.FC<ProgrammingLanguagesCertificateProps> = ({
  userFullName,
  userBirthDate,
  platformName = "CodeAcademy",
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
        return 'text-green-700 bg-green-50 border-green-200';
      case 'in_progress':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'locked':
        return 'text-gray-500 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Maîtrisé';
      case 'in_progress':
        return 'En cours';
      case 'locked':
        return 'À faire';
      default:
        return 'À faire';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in_progress':
        return '⏳';
      case 'locked':
        return '🔒';
      default:
        return '🔒';
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
            Certificat de Maîtrise des Langages de Programmation
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
          <div className={`relative p-8 rounded-lg border-4 transition-all duration-300 ${
            isUnlocked 
              ? 'bg-white border-primary/30 shadow-lg' 
              : 'bg-white border-muted/30'
          }`} style={{ fontFamily: 'Playfair Display, serif' }}>
            {/* Filigrane */}
            {!isUnlocked && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="transform rotate-45 text-6xl font-bold text-gray-200 opacity-30">
                  EN COURS
                </div>
              </div>
            )}
            
            <div className="text-center space-y-6 relative">
              {/* En-tête officiel */}
              <div className="border-b-2 border-primary/20 pb-4 mb-6">
                <div className="text-lg font-semibold text-primary mb-2">
                  🏆 CERTIFICAT OFFICIEL
                </div>
                <div className="text-sm text-muted-foreground">
                  {platformName} - Plateforme d'Apprentissage
                </div>
              </div>
              
              <div className="text-3xl font-bold text-primary mb-4">
                CERTIFICAT DE MAÎTRISE
              </div>
              
              <h2 className="text-xl font-semibold text-foreground">
                DES LANGAGES DE PROGRAMMATION
              </h2>
              
              <div className="text-lg text-muted-foreground">
                Ce certificat est délivré à :
              </div>
              
              {/* Informations personnelles */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 my-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <User className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-primary" style={{ fontSize: '26px' }}>
                    {userFullName}
                  </span>
                </div>
                {userBirthDate && (
                  <div className="text-sm text-muted-foreground mb-2">
                    Née le : {userBirthDate}
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  Formation suivie sur : {platformName}
                </div>
              </div>
              
              <div className="text-muted-foreground mb-6">
                pour avoir suivi le parcours de formation en Développement Web<br />
                et démontré ses compétences en maîtrisant les langages suivants :
              </div>
              
              {/* Tableau des langages */}
              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-lg text-primary mb-4">
                  🧠 Langages étudiés et maîtrisés :
                </h4>
                <div className="grid gap-3">
                  {languages.map((language, index) => (
                    <div key={index} className={`flex items-center justify-between p-4 rounded-lg border transition-all ${getLanguageColor(language.status)}`}>
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getStatusEmoji(language.status)}</span>
                        <span className="font-medium text-lg">
                          {language.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getLanguageIcon(language.status)}
                        <span className="text-sm font-medium">
                          {getStatusText(language.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Progression globale */}
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <div className="text-lg font-semibold text-blue-800 mb-2">
                  🎯 Progrès global : {completedLanguages}/{totalLanguages} langages validés
                </div>
                <div className="w-full bg-blue-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(completedLanguages / totalLanguages) * 100}%` }}
                  ></div>
                </div>
                <div className="text-sm text-blue-600 mt-2">
                  {Math.round((completedLanguages / totalLanguages) * 100)}% complété
                </div>
              </div>
              
              {/* État du certificat */}
              <div className={`p-4 rounded-lg border-2 ${
                isUnlocked 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-orange-50 border-orange-200'
              }`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className={`h-5 w-5 ${isUnlocked ? 'text-green-600' : 'text-orange-600'}`} />
                  <span className={`font-semibold ${isUnlocked ? 'text-green-800' : 'text-orange-800'}`}>
                    🔐 État du certificat : {isUnlocked ? 'Validé' : 'Non validé'}
                  </span>
                </div>
                {!isUnlocked && (
                  <div className="text-sm text-orange-600">
                    Téléchargement désactivé - Complétez tous les modules pour valider ce certificat
                  </div>
                )}
              </div>
              
              {/* Date et signature */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                {isUnlocked ? (
                  <div className="flex justify-between items-end">
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm text-primary font-medium">
                          📅 Certificat validé le {currentDate}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="border-t-2 border-primary w-40 mb-2"></div>
                      <p className="text-sm font-semibold text-gray-700">{platformName}</p>
                      <p className="text-xs text-gray-500">Directeur Pédagogique</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>📅 Date prévue de validation : À venir</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Statut et actions */}
          <div className="space-y-4">
            {!isUnlocked && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">
                      Ce certificat sera activé une fois que tous les langages auront été validés avec succès
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      Terminez tous les exercices et tests de chaque langage pour débloquer le téléchargement
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
                    🖨️ Télécharger le certificat en PDF
                  </Button>
                </>
              ) : (
                <>
                  <Button disabled variant="outline" className="flex-1" title="Complétez tous les exercices pour activer l'aperçu">
                    <Award className="h-4 w-4 mr-2" />
                    Aperçu indisponible
                  </Button>
                  <Button disabled className="flex-1" title="Ce certificat sera activé une fois que tous les langages auront été validés avec succès">
                    <Lock className="h-4 w-4 mr-2" />
                    Téléchargement désactivé
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
