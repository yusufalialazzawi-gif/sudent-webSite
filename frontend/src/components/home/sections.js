import { HomeHero, HomeStats } from './HomeHeroSections';
import {
  HomeServicesSection,
  HomeUniversitiesSection,
  HomeScholarshipsSection,
  HomeGraduateSection,
  HomeMajorsSection,
  HomeArticlesSection,
  HomeTestimonialsSection,
  HomeFinalCtaSection,
} from './HomeStudyFansSections';

// STUDYFANS.COM 1:1 EXACT ORDER & DESIGN SYSTEM (Focus on Turkey Admissions)
export const HOME_SECTIONS = [
  { key: 'hero', Component: HomeHero },
  { key: 'stats', Component: HomeStats },
  { key: 'services', Component: HomeServicesSection },
  { key: 'universities', Component: HomeUniversitiesSection },
  { key: 'majors', Component: HomeMajorsSection },
  { key: 'articles', Component: HomeArticlesSection },
  { key: 'scholarships', Component: HomeScholarshipsSection },
  { key: 'graduate', Component: HomeGraduateSection },
  { key: 'testimonials', Component: HomeTestimonialsSection },
  { key: 'final_cta', Component: HomeFinalCtaSection },
];

export default HOME_SECTIONS;
