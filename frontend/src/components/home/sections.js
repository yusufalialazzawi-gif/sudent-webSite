import { HomeHero, HomeStats, HomeQuickSearchSection } from './HomeHeroSections';
import {
  HomeServicesSection,
  HomeUniversitiesSection,
  HomeMajorsSection,
  HomeArticlesSection,
  HomeTestimonialsSection,
  HomeFinalCtaSection,
} from './HomeStudyFansSections';
import { HomeGraduateSpotlight } from './HomeUniversitySections';
import { HomeScholarshipsPreview } from './HomeOfferSections';
import { HomeFaqSection } from './HomeSocialSections';

// STUDYFANS — 100% TÜRK ÜNİVERSİTELERİ ODAKLI SIRALAMA
// (Kıbrıs ve Malezya kaldırıldı, mavi-beyaz logo teması, dinamik sayaçlar, bayraklı buton ve öğrenci yorumları)
export const HOME_SECTIONS = [
  { key: 'hero', Component: HomeHero },
  { key: 'stats', Component: HomeStats },
  { key: 'quick_search', Component: HomeQuickSearchSection },
  { key: 'services', Component: HomeServicesSection },
  { key: 'universities', Component: HomeUniversitiesSection },
  { key: 'graduate_spotlight', Component: HomeGraduateSpotlight },
  { key: 'majors', Component: HomeMajorsSection },
  { key: 'scholarships_preview', Component: HomeScholarshipsPreview },
  { key: 'articles', Component: HomeArticlesSection },
  { key: 'testimonials', Component: HomeTestimonialsSection },
  { key: 'faq', Component: HomeFaqSection },
  { key: 'final_cta', Component: HomeFinalCtaSection },
];

export default HOME_SECTIONS;
