
import React from 'react';
import { Certificate } from '@/types/certificate';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Award, Shield, Calendar, User } from 'lucide-react';

interface CertificatePDFProps {
  certificate: Certificate;
  userFullName?: string;
}

export const CertificatePDF: React.FC<CertificatePDFProps> = ({ 
  certificate, 
  userFullName = 'Étudiant' 
}) => {
  return (
    <div className="bg-white text-black p-8 max-w-4xl mx-auto border-8 border-primary/20 rounded-lg shadow-2xl">
      {/* En-tête du certificat */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-primary/10 rounded-full">
            <Award className="h-16 w-16 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-primary mb-2">CERTIFICAT D'ACCOMPLISSEMENT</h1>
        <div className="w-32 h-1 bg-primary mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">CodeAcademy - Plateforme d'Apprentissage</p>
      </div>

      {/* Corps du certificat */}
      <div className="text-center mb-8">
        <p className="text-xl mb-6 text-gray-700">Ceci certifie que</p>
        
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 border-b-2 border-primary/30 pb-2 inline-block">
            {userFullName}
          </h2>
        </div>

        <p className="text-lg mb-6 text-gray-700">a complété avec succès</p>
        
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-2xl font-semibold text-primary mb-3">
            {certificate.title}
          </h3>
          <p className="text-gray-600 mb-4">
            {certificate.description}
          </p>
          
          {/* Compétences couvertes */}
          {certificate.skills_covered.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Compétences maîtrisées :</p>
              <div className="flex flex-wrap justify-center gap-2">
                {certificate.skills_covered.map(skill => (
                  <span 
                    key={skill}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Statistiques */}
          <div className="flex justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              <span>{certificate.total_badges_earned} badges obtenus</span>
            </div>
            <div className="flex items-center gap-1">
              <span>{certificate.completion_percentage}% de réussite</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <div className="flex justify-between items-end">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Délivré le {format(new Date(certificate.issued_date), 'dd MMMM yyyy', { locale: fr })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-gray-500" />
            <span className="text-xs text-gray-500">
              Code de vérification: {certificate.verification_code}
            </span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="border-t-2 border-primary w-48 mb-2"></div>
          <p className="text-sm font-semibold text-gray-700">CodeAcademy</p>
          <p className="text-xs text-gray-500">Directeur Pédagogique</p>
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <Award className="h-64 w-64 text-primary transform rotate-12" />
      </div>
    </div>
  );
};
