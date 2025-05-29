import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCertificates } from '@/hooks/useCertificates';
import { CertificateDialog } from './CertificateDialog';
import { Download, Award, CheckCircle, Calendar, Shield, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuthState } from '@/hooks/useAuthState';

export const CertificatesSection = () => {
  const { certificates, loading, eligibleForCertificate, generateCertificate } = useCertificates();
  const { user } = useAuthState();
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewCertificate = (certificate) => {
    setSelectedCertificate(certificate);
    setDialogOpen(true);
  };

  const handleDownloadCertificate = (certificate) => {
    // Simulation du téléchargement direct
    const link = document.createElement('a');
    const blob = new Blob(['Certificat PDF simulé'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `certificat-${certificate.verification_code}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
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
      <Card className="professional-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 font-display">
            <Award className="h-6 w-6 text-primary" />
            <span className="text-foreground">Mes Certificats</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Certificats obtenus */}
            {certificates.length > 0 && (
              <div>
                <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Certificats obtenus
                </h3>
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
              </div>
            )}

            {/* Éligibilité pour nouveau certificat */}
            {eligibleForCertificate && (
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
            )}

            {/* Critères pour obtenir un certificat */}
            {!eligibleForCertificate && certificates.length === 0 && (
              <div className="p-6 bg-muted/50 rounded-lg border border-border">
                <h3 className="font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Comment obtenir votre certificat
                </h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Obtenir au moins 5 badges de compétences
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Atteindre 80% de progression dans au moins 3 compétences
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Compléter votre parcours d'apprentissage
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog pour afficher le certificat */}
      <CertificateDialog
        certificate={selectedCertificate}
        userFullName={user?.user_metadata?.full_name || 'Étudiant'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};
