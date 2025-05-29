
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuthState } from './useAuthState';
import type { Certificate } from '@/types/certificate';

export const useCertificates = () => {
  const { user } = useAuthState();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [eligibleForCertificate, setEligibleForCertificate] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCertificates();
      checkEligibility();
    }
  }, [user]);

  const fetchCertificates = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Simuler les certificats depuis les données existantes
      // Dans un vrai projet, il y aurait une table certificates
      const mockCertificates: Certificate[] = [];
      
      setCertificates(mockCertificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Erreur lors du chargement des certificats');
    } finally {
      setLoading(false);
    }
  };

  const checkEligibility = async () => {
    if (!user) return;
    
    try {
      // Vérifier les badges obtenus
      const { data: badgesData } = await supabase
        .from('user_badges')
        .select('*, badge:badges(*)')
        .eq('user_id', user.id);
      
      // Vérifier les compétences
      const { data: skillsData } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', user.id);
      
      const totalBadges = badgesData?.length || 0;
      const completedSkills = skillsData?.filter(skill => skill.progress >= 80)?.length || 0;
      
      // Critères pour obtenir le certificat de parcours complet
      const isEligible = totalBadges >= 5 && completedSkills >= 3;
      setEligibleForCertificate(isEligible);
      
    } catch (error) {
      console.error('Error checking eligibility:', error);
    }
  };

  const generateCertificate = async () => {
    if (!user || !eligibleForCertificate) return;
    
    try {
      // Générer un code de vérification unique
      const verificationCode = `CERT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // Récupérer les données pour le certificat
      const { data: badgesData } = await supabase
        .from('user_badges')
        .select('*, badge:badges(*)')
        .eq('user_id', user.id);
      
      const { data: skillsData } = await supabase
        .from('user_skills')
        .select('*')
        .eq('user_id', user.id);
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      const newCertificate: Certificate = {
        id: `cert-${Date.now()}`,
        user_id: user.id,
        certificate_type: 'full_journey',
        title: 'Certificat de Parcours Complet - CodeAcademy',
        description: `Ce certificat atteste que ${profileData?.full_name || 'l\'étudiant'} a complété avec succès son parcours d'apprentissage en programmation.`,
        issued_date: new Date().toISOString(),
        verification_code: verificationCode,
        skills_covered: skillsData?.map(skill => skill.skill_name) || [],
        total_badges_earned: badgesData?.length || 0,
        completion_percentage: 100
      };
      
      // Dans un vrai projet, on sauvegarderait en base
      setCertificates(prev => [...prev, newCertificate]);
      
      toast.success('Félicitations ! Votre certificat a été généré avec succès !');
      return newCertificate;
      
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('Erreur lors de la génération du certificat');
    }
  };

  return {
    certificates,
    loading,
    eligibleForCertificate,
    generateCertificate,
    refreshCertificates: fetchCertificates
  };
};
