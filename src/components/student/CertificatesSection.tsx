
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCertificates } from '@/hooks/useCertificates';
import { useExerciseProgress } from '@/hooks/useExerciseProgress';
import { CertificateDialog } from './CertificateDialog';
import { ConditionalCertificate } from './ConditionalCertificate';
import { ProgrammingLanguagesCertificate } from './ProgrammingLanguagesCertificate';
import { Download, Award, CheckCircle, Calendar, Shield, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuthState } from '@/hooks/useAuthState';

export const CertificatesSection = () => {
  const { certificates, loading, eligibleForCertificate, generateCertificate } = useCertificates();
  const { progress: exerciseProgress, loading: exerciseLoading } = useExerciseProgress();
  const { user } = useAuthState();
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Liste étendue des langages de programmation selon les spécifications
  const programmingLanguages = [
    { name: 'Python', status: 'completed' as const, progress: 100 },
    { name: 'Java', status: 'completed' as const, progress: 100 },
    { name: 'JavaScript', status: 'completed' as const, progress: 100 },
    { name: 'C', status: 'in_progress' as const, progress: 65 },
    { name: 'C++', status: 'locked' as const, progress: 0 },
    { name: 'PHP', status: 'locked' as const, progress: 0 },
    { name: 'SQL', status: 'in_progress' as const, progress: 40 }
  ];

  const completedLanguages = programmingLanguages.filter(lang => lang.status === 'completed').length;
  const totalLanguages = programmingLanguages.length;
  const isLanguagesCertificateUnlocked = completedLanguages === totalLanguages;

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setDialogOpen(true);
  };

  const handleDownloadCertificate = (certificate) => {
    const link = document.createElement('a');
    const blob = new Blob(['Certificat PDF simulé'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `certificat-${certificate?.verification_code || 'langages-programmation'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadConditionalCertificate = () => {
    if (exerciseProgress.isAllCompleted) {
      handleDownloadCertificate(null);
    }
  };

  const handleDownloadLanguagesCertificate = () => {
    if (isLanguagesCertificateUnlocked) {
      handleDownloadCertificate(null);
    }
  };

  const handleViewConditionalCertificate = () => {
    if (exerciseProgress.isAllCompleted) {
      // Créer un certificat temporaire pour l'affichage
      const tempCertificate = {
        id: 'temp-cert',
        title: 'Certificat de Parcours Complet',
        verification_code: `CERT-${Date.now()}`,
        issued_date: new Date().toISOString(),
        user_id: user?.id || '',
        certificate_type: 'full_journey' as const,
        description: `Ce certificat atteste que ${user?.full_name || 'l\'étudiant'} a complété avec succès son parcours d'apprentissage en programmation.`,
        skills_covered: ['JavaScript', 'Python', 'Algorithmes'],
        total_badges_earned: 5,
        completion_percentage: 100
      };
      setSelectedCertificate(tempCertificate);
      setDialogOpen(true);
    }
  };

  const handleViewLanguagesCertificate = () => {
    if (isLanguagesCertificateUnlocked) {
      const tempCertificate = {
        id: 'temp-languages-cert',
        title: 'Certificat de Maîtrise en Langages de Programmation',
        verification_code: `LANG-${Date.now()}`,
        issued_date: new Date().toISOString(),
        user_id: user?.id || '',
        certificate_type: 'skill_mastery' as const,
        description: `Ce certificat atteste que ${user?.full_name || 'l\'étudiant'} a maîtrisé les langages de programmation suivants : HTML, CSS, JavaScript, PHP, SQL.`,
        skills_covered: ['HTML', 'CSS', 'JavaScript', 'PHP', 'SQL'],
        total_badges_earned: 5,
        completion_percentage: 100
      };
      setSelectedCertificate(tempCertificate);
      setDialogOpen(true);
    }
  };

  if (loading || exerciseLoading) {
    return (
      <Card className="professional-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-display">
            <Award className="h-6 w-6 text-primary" />
            Certificats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Certificat de maîtrise en langages de programmation */}
        <ProgrammingLanguagesCertificate
          userFullName={user?.full_name || 'Étudiant'}
          userBirthDate="15 mars 1995"
          platformName="CodeAcademy"
          languages={programmingLanguages}
          isUnlocked={isLanguagesCertificateUnlocked}
          onDownload={handleDownloadLanguagesCertificate}
          onView={handleViewLanguagesCertificate}
        />

        {/* Certificat conditionnel principal */}
        <ConditionalCertificate
          userFullName={user?.full_name || 'Étudiant'}
          isUnlocked={exerciseProgress.isAllCompleted}
          completedExercises={exerciseProgress.completedExercises}
          totalExercises={exerciseProgress.totalExercises}
          onDownload={handleDownloadConditionalCertificate}
          onView={handleViewConditionalCertificate}
        />

        {/* Certificats obtenus (existants) */}
        {certificates.length > 0 && (
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 font-display">
                <Award className="h-6 w-6 text-primary" />
                <span className="text-foreground">Autres Certificats Obtenus</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {certificates.map(certificate => (
                  <div 
                    key={certificate.id}
                    className="p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground text-lg mb-2">
                          {certificate.title}
                        </h4>
                        <p className="text-muted-foreground text-sm mb-3">
                          {certificate.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(certificate.issued_date), 'dd MMMM yyyy', { locale: fr })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Shield className="h-4 w-4" />
                            Code: {certificate.verification_code}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewCertificate(certificate)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Voir
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadCertificate(certificate)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {certificate.skills_covered.map(skill => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-primary font-medium">
                        {certificate.total_badges_earned} badges obtenus
                      </span>
                      <span className="text-accent font-medium">
                        {certificate.completion_percentage}% de réussite
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Éligibilité pour nouveau certificat (legacy) */}
        {eligibleForCertificate && !exerciseProgress.isAllCompleted && (
          <Card className="professional-card">
            <CardContent className="pt-6">
              <div className="p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg border border-primary/30">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary/20 rounded-full">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary text-lg">
                      Félicitations ! 🎉
                    </h3>
                    <p className="text-muted-foreground">
                      Vous êtes éligible pour recevoir votre certificat de parcours complet !
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={generateCertificate}
                  className="education-button"
                >
                  <Award className="h-4 w-4 mr-2" />
                  Générer mon certificat
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dialog pour afficher le certificat */}
      <CertificateDialog
        certificate={selectedCertificate}
        userFullName={user?.full_name || 'Étudiant'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};
