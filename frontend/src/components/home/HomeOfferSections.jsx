import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import useSiteText from '../../hooks/useSiteText';
import { api } from '../../services/api';
import ProgramCard from '../common/ProgramCard';
import ServiceCard from '../common/ServiceCard';
import ScholarshipCard from '../common/ScholarshipCard';
import SectionCardCarousel from '../common/SectionCardCarousel';
import NotaryTranslationEquivalencySection from '../common/NotaryTranslationEquivalencySection';
import ScrollReveal from '../common/ScrollReveal';
import { HomeSection, SectionHeading, CardSkeleton } from './homeShared';
import { PROGRAMS_VIEW_ALL, SCHOLARSHIPS_VIEW_ALL } from './homeDefaults';

// 6) BÖLÜMLER / PROGRAMLAR VİTRİNİ
export function HomeProgramsPreview() {
  const { t } = useTranslation();
  const { text, currentLang } = useSiteText();

  const { data, isLoading } = useQuery({
    queryKey: ['home-programs', currentLang],
    queryFn: () => api.getPrograms({ limit: 12, lang: currentLang }),
  });

  return (
    <HomeSection>
      <ScrollReveal>
        <SectionHeading
          kicker={text('home_programs_title', () => t('programs.title'))}
          title={t('programs.title')}
          subtitle={t('programs.subtitle')}
          to="/programs"
          linkLabel={PROGRAMS_VIEW_ALL[currentLang]}
        />
      </ScrollReveal>

      {isLoading ? (
        <CardSkeleton count={4} height="h-64" />
      ) : (
        <SectionCardCarousel
          items={data?.data || []}
          renderItem={(prog) => <ProgramCard program={prog} />}
          desktopItems={4}
          tabletItems={2}
          mobileItems={1}
          interval={3000}
        />
      )}
    </HomeSection>
  );
}

// 7) HİZMETLER — başlık ve arka plan fotoğrafı admin panelinden gelir.
export function HomeServicesPreview() {
  const { t } = useTranslation();
  const { text, currentLang } = useSiteText();

  const { data } = useQuery({
    queryKey: ['home-services', currentLang],
    queryFn: () => api.getServices(currentLang),
  });

  return (
    <HomeSection bgKey="home_services_bg">
      <ScrollReveal>
        <SectionHeading
          center
          kicker={t('services.title')}
          title={text('home_services_title', () => t('services.title'))}
          subtitle={t('services.subtitle')}
        />
      </ScrollReveal>

      <SectionCardCarousel
        items={data?.data || []}
        renderItem={(serv) => <ServiceCard service={serv} />}
        desktopItems={4}
        tabletItems={2}
        mobileItems={1}
        interval={3400}
      />
    </HomeSection>
  );
}

// 8) NOTER / YEMİNLİ TERCÜME / DENKLİK BÖLÜMÜ
export function HomeNotarySection() {
  return (
    <HomeSection>
      <ScrollReveal>
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
          <NotaryTranslationEquivalencySection />
        </div>
      </ScrollReveal>
    </HomeSection>
  );
}

// 9) BURSLAR VİTRİNİ
export function HomeScholarshipsPreview() {
  const { t } = useTranslation();
  const { text, currentLang } = useSiteText();

  const { data } = useQuery({
    queryKey: ['home-scholarships', currentLang],
    queryFn: () => api.getScholarships({ limit: 8, lang: currentLang }),
  });

  if (!data?.data || data.data.length === 0) return null;

  return (
    <HomeSection>
      <ScrollReveal>
        <div className="bg-gradient-to-br from-brand-navy-950 via-brand-navy-900 to-brand-navy-950 rounded-3xl p-8 sm:p-12 border border-brand-amber-500/30 text-white">
          <SectionHeading
            dark
            kicker={t('scholarships.title')}
            title={text('home_scholarships_title', () => t('scholarships.title'))}
            subtitle={t('scholarships.subtitle')}
            to="/scholarships"
            linkLabel={SCHOLARSHIPS_VIEW_ALL[currentLang]}
          />

          <SectionCardCarousel
            items={data.data}
            renderItem={(sch) => <ScholarshipCard scholarship={sch} />}
            desktopItems={2}
            tabletItems={2}
            mobileItems={1}
            interval={3500}
          />
        </div>
      </ScrollReveal>
    </HomeSection>
  );
}
