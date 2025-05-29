
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CertificatePDF } from './CertificatePDF';
import { Certificate } from '@/types/certificate';
import { Download, Eye, X } from 'lucide-react';

interface CertificateDialogProps {
  certificate: Certificate | null;
  userFullName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CertificateDialog: React.FC<CertificateDialogProps> = ({
  certificate,
  userFullName,
  open,
  onOpenChange,
}) => {
  const handleDownload = () => {
    if (!certificate) return;
    
    // Créer un canvas pour capturer le contenu du certificat
    const element = document.getElementById('certificate-content');
    if (!element) return;

    // Simulation du téléchargement - dans un vrai projet, 
    // on utiliserait html2canvas + jsPDF
    const link = document.createElement('a');
    link.href = '#';
    link.download = `certificat-${certificate.verification_code}.pdf`;
    
    // Pour la démo, on va simuler le téléchargement
    const blob = new Blob(['Certificat PDF simulé'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    link.href = url;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!certificate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Aperçu du Certificat
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handlePrint}
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
            <Button
              onClick={handleDownload}
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger PDF
            </Button>
          </div>

          {/* Certificat */}
          <div id="certificate-content" className="print:shadow-none">
            <CertificatePDF 
              certificate={certificate} 
              userFullName={userFullName}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
