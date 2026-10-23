import { HomeHero, HomeStats, HomeAdmissionSlider } from './HomeHeroSections';
import { HomeUniversitiesPreview, HomeGraduateSpotlight } from './HomeUniversitySections';
import {
  HomeProgramsPreview,
  HomeServicesPreview,
  HomeNotarySection,
  HomeScholarshipsPreview,
} from './HomeOfferSections';
import {
  HomeTestimonials,
  HomeBlogPreview,
  HomeFaqSection,
  HomeBottomCta,
} from './HomeSocialSections';

// Ana sayfa bölüm kaydı: sıralama ve görünürlük admin panelindeki "Sayfa Bölümleri"nden gelir.
// Bu listedeki sıra yalnızca admin sıralaması yüklenemediğinde kullanılır.
export const HOME_SECTIONS = [
  { key: 'hero', Component: HomeHero },
  { key: 'stats', Component: HomeStats },
  { key: 'universities_preview', Component: HomeUniversitiesPreview },
  { key: 'admission_slider', Component: HomeAdmissionSlider },
  { key: 'programs_preview', Component: HomeProgramsPreview },
  { key: 'services_preview', Component: HomeServicesPreview },
  { key: 'graduate_spotlight', Component: HomeGraduateSpotlight },
  { key: 'notary_equivalency', Component: HomeNotarySection },
  { key: 'scholarships_preview', Component: HomeScholarshipsPreview },
  { key: 'testimonials', Component: HomeTestimonials },
  { key: 'blog_preview', Component: HomeBlogPreview },
  { key: 'faq', Component: HomeFaqSection },
  { key: 'bottom_cta', Component: HomeBottomCta },
];

export default HOME_SECTIONS;
