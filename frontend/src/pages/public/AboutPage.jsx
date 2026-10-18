import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import {
  GraduationCap,
  ShieldCheck,
  Target,
  Eye,
  Award,
  Users,
  CheckCircle2,
  HeartHandshake,
  Compass,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';
import TestimonialCard from '../../components/common/TestimonialCard';

export default function AboutPage() {
  const { t } = useTranslation();
  const { currentLang } = useLanguage();

  const { data: testimonialsData } = useQuery({
    queryKey: ['about-testimonials'],
    queryFn: () => api.getTestimonials(),
  });

  return (
    <div className="space-y-16 py-12">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <span className="text-xs font-bold text-brand-amber-600 uppercase tracking-wider block">
          من نحن
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-brand-navy-950 font-cairo">
          ريادة الاستشارات التعليمية وبناء المستقبل الأكاديمي في تركيا
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          تأسست مؤسسة المجد للقبولات الجامعية برؤية واضحة تهدف إلى تذليل كافة الصعاب أمام الطلاب الدوليين، وتمكينهم من الالتحاق بأرقى الجامعات التركية بأعلى مستويات الشفافية والمصداقية.
        </p>
      </section>

      {/* Mission & Vision Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-amber-50 flex items-center justify-center text-brand-amber-500">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-brand-navy-950 font-cairo">رسالتنا الأكاديمية</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              تقديم استشارات تعليمية نزيهة ومجانية تلبي طموحات الطلاب وتوجههم نحو التخصصات الملائمة لسوق العمل العالمي، مع تأمين خصومات حصرية ومتابعة قانونية وإدارية حتى التخرج.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-navy-50 flex items-center justify-center text-brand-navy-900">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-brand-navy-950 font-cairo">رؤيتنا المستقبلية</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              أن نكون الخيار الأول والأكثر موثوقية في الشرق الأوسط وشمال أفريقيا للدراسة في تركيا، من خلال بناء جسور تعليمية متينة مع نخبة الجامعات التركية والعالمية.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-brand-navy-950 font-cairo">قيمنا ومبادئنا</h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">الركائز الأساسية التي تنطلق منها كافة خدماتنا</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
              <h3 className="font-bold text-base text-brand-navy-950 font-cairo">الشفافية المطلقة</h3>
              <p className="text-slate-500 text-xs leading-relaxed">حقائق وأرقام مؤكدة دون أي وعود وهمية أو تكاليف خفية.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
              <Award className="w-8 h-8 text-brand-amber-500" />
              <h3 className="font-bold text-base text-brand-navy-950 font-cairo">الخبرة والاعتماد</h3>
              <p className="text-slate-500 text-xs leading-relaxed">فريق استشاري معتمد يمتلك أكثر من 8 سنوات من الخبرة الميدانية.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
              <HeartHandshake className="w-8 h-8 text-blue-500" />
              <h3 className="font-bold text-base text-brand-navy-950 font-cairo">رعاية الطالب أولاً</h3>
              <p className="text-slate-500 text-xs leading-relaxed">مرافقة مستمرة في كل خطوة حتى يستقر الطالب بأمان في جامعته.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
              <Compass className="w-8 h-8 text-purple-500" />
              <h3 className="font-bold text-base text-brand-navy-950 font-cairo">التوجيه المستدام</h3>
              <p className="text-slate-500 text-xs leading-relaxed">مساعدة في اختيار التخصصات المستقبلية والتحضير لسوق العمل.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials in About page */}
      {testimonialsData?.data && testimonialsData.data.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-brand-navy-950 font-cairo">
              {t('testimonials.title')}
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">{t('testimonials.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialsData.data.map((item) => (
              <TestimonialCard key={item.id} testimonial={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
